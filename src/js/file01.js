// 1. Al inicio del documento, importar fetchProducts y fetchCategories desde functions.js
import { fetchProducts, fetchCategories } from './functions.js';
import { saveVote } from './firebase.js';

// ==========================================
// DEFINICIÓN DE FUNCIONES
// ==========================================

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.remove("hidden");
    }
};

const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

// 2. Definir renderCategories como una función asincrónica (antes de la autoejecución)
const renderCategories = async () => {
    // 3. Bloque try-catch
    try {
        // 4. Esperar la resolución de fetchCategories con la URL del XML
        const result = await fetchCategories('https://data-dawm.github.io/datum/reseller/categories.xml');

        // 5. Estructura condicional para verificar si result.success es true o false
        if (result.success) {
            // Caso TRUE:
            // Almacenar en container la referencia al elemento con id "categories"
            const container = document.getElementById('categories');
            if (!container) {
                console.warn('Elemento #categories no encontrado en el DOM.');
                return;
            }

            // Reemplazar el contenido anterior con la opción predeterminada deshabilitada
            container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;

            // Almacenar en categoriesXML el contenido de result.body (que es el documento XML parseado)
            const categoriesXML = result.body;

            // Obtener la colección de elementos <category> del XML
            const categories = categoriesXML.getElementsByTagName('category');

            // Recorrer la lista de elementos en categories utilizando un bucle for...of
            for (let category of categories) {
                // Crear la opción HTML con los marcadores de posición
                let categoryHTML = `<option value="[ID]">[NAME]</option>`;

                // Utilizar getElementsByTagName y textContent para extraer id y name del nodo actual
                const id = category.getElementsByTagName('id')[0].textContent;
                const name = category.getElementsByTagName('name')[0].textContent;

                // Reemplazar los marcadores de posición con los valores correspondientes
                categoryHTML = categoryHTML.replace('[ID]', id);
                categoryHTML = categoryHTML.replace('[NAME]', name);

                // Concatenar el nuevo HTML en la propiedad innerHTML del container
                container.innerHTML += categoryHTML;
            }
        } else {
            // Caso FALSE: Mostrar una alerta con el mensaje de error (guardado en result.body)
            alert('Error al cargar las categorías: ' + result.body);
        }

    } catch (error) {
        // Bloque CATCH: Mostrar una alerta en caso de fallos inesperados en el hilo de ejecución
        alert('Ocurrió un error en la aplicación: ' + error.message);
    }
};

const renderProducts = () => {
    fetchProducts('https://data-dawm.github.io/datum/reseller/products.json')
        .then(result => {
            if (result.success) {
                const container = document.getElementById('products-container');
                if (!container) {
                    console.warn('Elemento #products-container no encontrado en el DOM.');
                    return;
                }
                const products = result.body.slice(0, 6);

                products.forEach(product => {
                    let productHTML = `
                        <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                            <img
                                class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
                                src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
                            <h3
                                class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
                                $[PRODUCT.PRICE]
                            </h3>
                            <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
                            <div class="space-y-2">
                                <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                                    Ver en Amazon
                                </a>
                                <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
                            </div>
                        </div>
                    `;

                    productHTML = productHTML.replaceAll("[PRODUCT.IMGURL]", product.imgUrl);
                    productHTML = productHTML.replaceAll("[PRODUCT.PRICE]", product.price);
                    productHTML = productHTML.replaceAll("[PRODUCT.TITLE]", product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title);
                    productHTML = productHTML.replaceAll("[PRODUCT.PRODUCTURL]", product.productURL);
                    productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY_ID]', product.category_id);

                    container.innerHTML += productHTML;
                });
            } else {
                alert('Error al cargar los productos: ' + result.body);
            }
        })
        .catch(error => {
            console.error('Error crítico en el flujo de ejecución:', error);
        });
};

const enableForm = () => {
    const form = document.getElementById('form_voting');
    if (!form) {
        console.warn('Elemento #form_voting no encontrado en el DOM.');
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const selectCategory = document.getElementById('select_product').value;
        saveVote(selectCategory).then((result) => {
            alert(result.message);
        }).catch((error) => {
            alert('Error al guardar el voto: ' + (error.message || error));
        });

        const productID = selectProduct.value;

        saveVote(productID)
            .then((result) => {
                alert(result.message);
            })
            .catch((error) => {
                alert('Error al guardar el voto: ' + (error.message || error));
            });
    });
};

// ==========================================
// FUNCIÓN DE AUTOEJECUCIÓN (IIFE)
// ==========================================
(() => {
    showToast();
    showVideo();
    renderCategories(); // <-- Llame a la función renderCategories aquí
    renderProducts();
    enableForm();
})();
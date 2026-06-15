'use strict';

let fetchCategories = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        let text = await response.text();

        const parser = new DOMParser();
        const data = parser.parseFromString(text, "application/xml");

        return {
            success: true,
            body: data
        };
    } catch (error) {
        return {
            success: false,
            body: error.message
        };
    }
}

// NUEVA IMPLEMENTACIÓN ADAPTADA PARA PRODUCTS (JSON)
let fetchProducts = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // Como es un JSON, usamos response.json() en vez de text/DOMParser
        const data = await response.json();

        return {
            success: true,
            body: data // Aquí viajará el arreglo de productos
        };
    } catch (error) {
        return {
            success: false,
            body: error.message
        };
    }
}

export { fetchCategories, fetchProducts }
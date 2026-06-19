// =====================
// HAMBURGER MENU
// =====================
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// =====================
// PET GALLERY
// =====================
let allPets = [];

async function loadPets() {
  try {
    const response = await fetch('/data/mascotas.json');
    const pets = await response.json();
    allPets = pets;
    renderGallery(pets);
  } catch (error) {
    console.error('Error loading pets:', error);
  }
}

function renderGallery(pets) {
  const container = document.getElementById('galeria-contenedor');
  container.innerHTML = '';

  if (pets.length === 0) {
    container.innerHTML = `
      <p class="text-center text-gray-500 col-span-3 py-8">
        No pets found for this filter.
      </p>`;
    return;
  }

  pets.forEach(pet => {
    const genderIcon = pet.sexo === 'macho' ? '♂️' : '♀️';
    const unitRaw = (pet.unidad || '').toLowerCase();
    const ageUnit = (unitRaw.includes('year') || unitRaw.includes('año'))
      ? (pet.edad === 1 ? 'year' : 'years')
      : (pet.edad === 1 ? 'month' : 'months');
    const card = `
      <div class="bg-green-100 rounded-xl overflow-hidden shadow-lg transition transform hover:scale-105">
        <img src="${pet.imagen}" alt="${pet.nombre}"
          class="w-full h-56 object-cover"
          onerror="this.src='https://placehold.co/600x400/86efac/166534?text=${pet.nombre}'">
        <div class="p-5">
          <div class="flex justify-between items-center mb-1">
            <h3 class="text-xl font-bold text-green-800">${pet.nombre} ${genderIcon}</h3>
            <span class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full capitalize">${pet.tipo === 'perro' ? 'Dog' : 'Cat'}</span>
          </div>
          <p class="text-sm text-gray-500 mb-1">${pet.edad} ${ageUnit}</p>
          <p class="text-gray-600 text-sm">${pet.personalidad}</p>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// =====================
// FILTER BY TYPE
// =====================
function filterPets(type) {
  // Update active button styles
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.remove('bg-green-700', 'text-white');
    btn.classList.add('border-2', 'border-green-700', 'text-green-700');
  });

  const activeBtn = document.querySelector(`[data-tipo="${type}"]`);
  activeBtn.classList.add('bg-green-700', 'text-white');
  activeBtn.classList.remove('border-2', 'border-green-700', 'text-green-700');

  // Filter pets
  if (type === 'todos') {
    renderGallery(allPets);
  } else {
    const filtered = allPets.filter(p => p.tipo === type);
    renderGallery(filtered);
  }
}

// Filter button events
document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    filterPets(btn.dataset.tipo);
  });
});

// =====================
// INITIALIZE
// =====================
loadPets();
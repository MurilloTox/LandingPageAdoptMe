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
    populatePetSelect(pets);
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
      <div class="bg-green-100 rounded-xl overflow-hidden shadow-lg transition transform hover:scale-105 cursor-pointer"
        data-nombre="${pet.nombre}" role="button" tabindex="0">
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
          <button type="button"
            class="adopt-card-btn mt-4 w-full bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2 rounded-full transition duration-300"
            data-nombre="${pet.nombre}">
            Adopt ${pet.nombre}
          </button>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });

  // Card click events: scroll to the adoption form and preselect this pet
  container.querySelectorAll('[data-nombre]').forEach(card => {
    card.addEventListener('click', () => {
      goToAdoptionForm(card.dataset.nombre);
    });
  });
}

// =====================
// ADOPTION FORM LINKING
// =====================
function populatePetSelect(pets) {
  const select = document.getElementById('adopt-pet');
  if (!select) return;

  select.innerHTML = '<option value="">-- Select a pet --</option>';
  pets.forEach(pet => {
    const option = document.createElement('option');
    option.value = pet.nombre;
    option.textContent = pet.nombre;
    select.appendChild(option);
  });
}

function goToAdoptionForm(petName) {
  const select = document.getElementById('adopt-pet');
  if (select) {
    select.value = petName;
  }

  const adoptSection = document.getElementById('adopt');
  if (adoptSection) {
    adoptSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// =====================
// ADOPTION FORM SUBMISSION
// =====================
const adoptionForm = document.getElementById('adoption-form');

if (adoptionForm) {
  adoptionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('adopt-submit-btn');
    const errorMsg = document.getElementById('adopt-error');
    errorMsg.classList.add('hidden');

    const payload = {
      nombre: document.getElementById('adopt-name').value,
      email: document.getElementById('adopt-email').value,
      telefono: document.getElementById('adopt-phone').value,
      mascota: document.getElementById('adopt-pet').value,
      mensaje: document.getElementById('adopt-message').value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      showRequestResult(data);
      adoptionForm.reset();
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      errorMsg.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Request';
    }
  });
}

function showRequestResult(data) {
  const resultSection = document.getElementById('request-result');
  const resultCard = document.getElementById('request-result-card');
  if (!resultSection || !resultCard) return;

  resultCard.innerHTML = `
    <p><span class="font-semibold text-green-800">Request ID:</span> ${data.id}</p>
    <p><span class="font-semibold text-green-800">Name:</span> ${data.nombre || '-'}</p>
    <p><span class="font-semibold text-green-800">Email:</span> ${data.email || '-'}</p>
    <p><span class="font-semibold text-green-800">Phone:</span> ${data.telefono || '-'}</p>
    <p><span class="font-semibold text-green-800">Pet:</span> ${data.mascota || '-'}</p>
    <p><span class="font-semibold text-green-800">Message:</span> ${data.mensaje || '-'}</p>
    <p class="text-green-700 font-semibold pt-2">✅ Thanks! Your adoption request has been received. We'll be in touch soon. 🐾</p>
  `;

  resultSection.classList.remove('hidden');
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
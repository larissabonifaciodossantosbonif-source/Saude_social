const healthPlaces = [
    {
        id: 1,
        name: 'Hospital Central de Urgência',
        type: 'hospital',
        categoryName: 'Hospital Geral',
        address: 'Av. Principal, 1000 - Centro',
        lat: -23.55052,
        lng: -46.633308,
        phone: '(11) 3300-0000',
        status: 'Aberto 24 horas',
        statusClass: 'status-success',
        specialties: ['Pronto-Socorro', 'UTI', 'Pediatria', 'Ortopedia'],
        distance: null
    },
    {
        id: 2,
        name: 'UPA 24h - Unidade de Pronto Atendimento',
        type: 'upa',
        categoryName: 'UPA 24h',
        address: 'Rua das Flores, 450 - Bairro Novo',
        lat: -23.558,
        lng: -46.64,
        phone: '(11) 3300-1111',
        status: 'Aberto 24 horas',
        statusClass: 'status-success',
        specialties: ['Clínica Geral', 'Suturas', 'Exames Rápidos'],
        distance: null
    },
    {
        id: 3,
        name: 'UBS São José - Posto de Saúde',
        type: 'ubs',
        categoryName: 'Posto de Saúde (UBS)',
        address: 'Praça da Comunidade, 12 - Jardim Sol',
        lat: -23.542,
        lng: -46.62,
        phone: '(11) 3300-2222',
        status: 'Aberto • Fecha às 17h',
        statusClass: 'status-warning',
        specialties: ['Vacinação', 'Consultas de Rotina', 'Dentista'],
        distance: null
    },
    {
        id: 4,
        name: 'Clínica da Família Jardim Aurora',
        type: 'ubs',
        categoryName: 'Clínica da Família',
        address: 'Rua da Esperança, 88 - Jardim Aurora',
        lat: -23.5365,
        lng: -46.645,
        phone: '(11) 3300-3333',
        status: 'Aberto • Fecha às 18h',
        statusClass: 'status-warning',
        specialties: ['Pediatria', 'Ginecologia', 'Consulta Geral'],
        distance: null
    },
    {
        id: 5,
        name: 'Hospital Municipal de Especialidades',
        type: 'hospital',
        categoryName: 'Hospital Especializado',
        address: 'Alameda das Palmeiras, 540 - Vila Verde',
        lat: -23.563,
        lng: -46.648,
        phone: '(11) 3300-4444',
        status: 'Aberto 24 horas',
        statusClass: 'status-success',
        specialties: ['Cardiologia', 'Neurologia', 'Oncologia'],
        distance: null
    }
];

const symptomMessages = {
    'Dor de cabeça intensa': {
        title: 'Atenção: dor de cabeça intensa',
        text: 'Se a dor for súbita, muito forte ou vier acompanhada de febre, confusão, fraqueza ou alteração visual, procure rapidamente um pronto-socorro ou unidade de urgência.'
    },
    'Febre alta e cansaço': {
        title: 'Possível sinal de alerta',
        text: 'Febre acima de 38,5°C e cansaço intenso podem exigir avaliação médica. Se houver dificuldade para respirar, desmaio ou piora rápida, procure atendimento imediato.'
    },
    'Dificuldade para respirar': {
        title: 'Situação prioritária',
        text: 'Qualquer dificuldade para respirar merece atenção imediata. Vá para uma unidade de urgência ou ligue para 192 se o quadro estiver piorando rapidamente.'
    },
    'Dor forte no peito': {
        title: 'Sinal de urgência',
        text: 'Dor no peito com pressão, suor frio, tontura ou falta de ar pode indicar risco grave. Procure atendimento emergencial imediatamente.'
    },
    'Vômitos persistentes': {
        title: 'Cuidados com hidratação',
        text: 'Se houver vômitos repetidos, desidratação, dor forte, sangue ou febre, busque avaliação médica. Em casos severos, procure urgência.'
    },
    'Dor abdominal forte': {
        title: 'Avaliação médica recomendada',
        text: 'Dor abdominal intensa, contínua ou com febre, vômito ou sangue exige atenção. Se a situação for forte ou súbita, procure urgência.'
    }
};

let currentCategory = 'all';

const geoStatus = document.getElementById('geo-status');
const geoText = document.getElementById('geo-text');
const searchInput = document.getElementById('search-input');

function setGeoStatus(message, type = 'info') {
    geoText.textContent = message;
    geoStatus.classList.remove('is-info', 'is-success', 'is-warning');
    geoStatus.classList.add(`is-${type}`);
}

function calculateDistanceKm(lat1, lng1, lat2, lng2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

function renderPlaces(places) {
    const grid = document.getElementById('places-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (places.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-magnifying-glass"></i>
                <h4>Nenhuma unidade encontrada</h4>
                <p>Tente outro termo de busca ou altere o filtro selecionado.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = places.map((place) => {
        const distanceText = place.distance !== null ? `${place.distance.toFixed(1)} km de você` : 'Distância não calculada';
        const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

        return `
            <article class="place-card">
                <div class="place-card__top">
                    <span class="place-tag">${place.categoryName}</span>
                    <span class="status-badge ${place.statusClass}">${place.status}</span>
                </div>

                <h4>${place.name}</h4>
                <p class="place-address"><i class="fa-solid fa-location-dot"></i> ${place.address}</p>
                <p class="place-distance"><i class="fa-solid fa-route"></i> ${distanceText}</p>

                <div class="specialties">
                    ${place.specialties.map((specialty) => `<span>${specialty}</span>`).join('')}
                </div>

                <div class="place-actions">
                    <a href="${mapUrl}" target="_blank" rel="noreferrer">Como chegar</a>
                    <a href="tel:${place.phone.replace(/[^\d]/g, '')}" class="secondary">Ligar</a>
                </div>
            </article>
        `;
    }).join('');
}

function filterPlaces() {
    const query = searchInput.value.trim().toLowerCase();

    const filtered = healthPlaces.filter((place) => {
        const matchesCategory = currentCategory === 'all' || place.type === currentCategory;
        const searchableValue = `${place.name} ${place.address} ${place.specialties.join(' ')}`.toLowerCase();
        const matchesQuery = searchableValue.includes(query);
        return matchesCategory && matchesQuery;
    });

    renderPlaces(filtered);
}

function setCategory(category, button) {
    currentCategory = category;

    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.classList.toggle('active', btn === button);
    });

    filterPlaces();
}

function getUserLocation() {
    if (!('geolocation' in navigator)) {
        setGeoStatus('Seu navegador não suporta geolocalização.', 'warning');
        return;
    }

    setGeoStatus('Localizando sua região...', 'info');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            healthPlaces.forEach((place) => {
                place.distance = calculateDistanceKm(userCoords.lat, userCoords.lng, place.lat, place.lng);
            });

            setGeoStatus('Localização atualizada com sucesso.', 'success');
            filterPlaces();
        },
        () => {
            setGeoStatus('Não foi possível acessar sua localização. Você pode visualizar as unidades mais próximas manualmente.', 'warning');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => setCategory(button.dataset.category, button));
});

searchInput.addEventListener('input', filterPlaces);
document.getElementById('gps-btn').addEventListener('click', getUserLocation);

document.querySelectorAll('.symptom-btn').forEach((button) => {
    button.addEventListener('click', () => {
        const symptom = button.dataset.symptom;
        const message = symptomMessages[symptom];
        const resultBox = document.getElementById('triage-result');

        if (!message) {
            resultBox.innerHTML = '<strong>Selecione um sintoma</strong><p>Escolha uma opção acima para receber uma orientação rápida.</p>';
            return;
        }

        resultBox.innerHTML = `
            <strong>${message.title}</strong>
            <p>${message.text}</p>
        `;
    });
});

healthPlaces.forEach((place) => {
    place.distance = null;
});

renderPlaces(healthPlaces);












































































































































































































































































a
          
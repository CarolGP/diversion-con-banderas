const countriesList = document.getElementById('countries-list');
const info = document.getElementById('info');
const infoUrl = 'https://restcountries.com/v3.1/all?fields=name,flags,car,population,capital';

document.addEventListener('DOMContentLoaded', startApp);

async function startApp() {
  try {
    const countries = await getCountries();
    sortedCountries(countries);
    renderCountries(countries);
    setupInfoCloseListener();
  } catch (error) {
    countriesList.innerHTML = '<li>Ha habido un error.</li>';
  }
}

async function getCountries() {
  const response = await fetch(infoUrl);
  if (!response.ok) {
    throw new Error('Error al hacer la petición a la API');
  } const data = await response.json();
  return data;
}

function sortedCountries(countries) {
  countries.sort((a, b) => {
    const nameA = a.name.common.toUpperCase();
    const nameB = b.name.common.toUpperCase();
    return nameA.localeCompare(nameB, 'es');
  });
}

function renderCountries(countries) {
  const allCountriesTemplate = countries
    .map((country, index) => {
      const {flags,name: { common },} = country;
      return `<li class="card" data-index="${index}">
          <h2>${common}</h2>
          <img src="${flags.png}" alt="${flags.alt || 'Bandera de ' + common}" />
        </li>
      `;
    })
    .join('');

  countriesList.innerHTML = allCountriesTemplate;


  const cards = document.querySelectorAll('.card');
  
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const index = card.dataset.index;
      const country = countries[index];
      openCountryInfo(country);
    });
  });
}

function openCountryInfo(country) {
  const { flags, population, car, capital } = country;
  const common = country.name.common;

  const capitalText = capital && capital.length ? capital[0] : 'Sin capital';
  const side = car && car.side ? car.side : 'right';
  const populationText = population.toLocaleString('es-ES');
  const sideText = side === 'left' ? 'left' : 'right';

  info.innerHTML = `
    <section class="info-country">
      <div class="info-container">
        <div class="closed">X</div>
        <h2>${common}</h2>
        <p>Capital: ${capitalText}</p>
        <img src="${flags.png}" alt="${flags.alt || 'Bandera de ' + common}" />
        <p>Población: ${populationText}</p>
        <p>Dirección del coche: ${sideText}</p>
      </div>
    </section>
  `;

  info.classList.add('visible');
}

function setupInfoCloseListener() {
  info.addEventListener('click', (e) => {
    if (e.target.classList.contains('closed')) {
      closeInfo();
    }
  });
}

function closeInfo() {
  info.classList.remove('visible');
  info.innerHTML = '';
}
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');
import './css/styles.css';
import API from './api-service'

const DEBOUNCE_DELAY = 300;

const searchCountry = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const inputEl = document.querySelector('#search-box');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();
  const name = e.target.value.trim();

  searchCountry.innerHTML = '';
  countryInfo.innerHTML = '';

  API.fetchCountries(name)
    .then(renderCountries)
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function renderCountries(country) {
  if (country.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    ); return;
  } else if (country.length > 2 && country.length < 10) {
    // console.log(
    //   country.map(({ name, flags }) => `${name}, ${flags.svg}`).join(' ')
    // );
    country
      .map(({ name, flags }) => {
        const searchTemplate = `<li><img src="${flags.svg}" class="flag" alt="flags" width=20px>${name}</li>`;
        searchCountry.insertAdjacentHTML('beforeend', searchTemplate);
      })
      .join(' '); return;
  } else if (country.length === 1) {
    country.map(({ flags, name, capital, population, languages }) => {
      const template = `<div class="country-card">
      <img src="${flags.svg}" class="country-flag" alt="flag" width=60px>
      <h2 class="country-name">${name}</h2>
      <ul class="country-info">
        <li>Capital: <span>${capital}</span></li>
        <li>Population: <span>${population}</span></li>
        <li>Languages: <span>${languages.map(lang => lang.name)}</span></li>
      </ul>
    </div>`;
      countryInfo.innerHTML = template;
    }); return;
  }
}

// function fetchCountries(name) {
//   return fetch(
//     `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`
//   )
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(response.status);
//       } return response.json();
//   })  
// }

 return Notify.failure('Oops, there is no country with that name');

import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';


const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const searchForm = document.querySelector('input#search-box');
const countryList = document.querySelector('country-list');
const countryCard = document.querySelector('.country-info');

searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const form = e.target;
    const searchQuery = form.value.trim();

    if (searchQuery === '') {
        resetInfo();
        return;
    }

    fetchCountries(searchQuery).then(countryInfo).catch(onError);
}

function countryInfo(countries) {
    if (countries.length > 10) {
        resetInfo();
        return Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countries.length > 1) {
        resetInfo();
        renderCountryList(countries);
    } else if (countries.length === 1) {
        resetInfo();
        renderCountryCard(countries);
    }
}

function renderCountryList(countries) {
    const markupList = countries
    .map(({flags, name}) => {
    return `<li>
        <p class="country__name"><img src="${flags.svg}" width="25" height="25">${name.official}</p>
        </li>`;
    })
        .join("");
    countryList.innerHTML = markupList;
}

function renderCountryCard(countries) {
    const markupCard = countries
    .map(({flags, name, capital, population, languages}) => {
    return `
        <p><img src="${flags.svg}"> ${name.official}</p>
        <p><span>Capital</span>: ${capital}</p>
        <p><span>Population</span>: ${population}</p>
        <p><span>Languages</span>: ${Object.values(languages).join(',')}</p>
        `;
    })
        .join("");
    countryCard = markupCard;
}

function resetInfo() {
    countryList.innerHTML = '';
    countryCard.innerHTML = '';
}

function onError(error) {
    resetInfo();
    Notify.failure('Oops, there is no country with that name');
}
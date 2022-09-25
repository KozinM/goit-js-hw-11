// styles import
import './css/styles.css';

//importing fetchContriesList
import { fetchCountries} from './fetchCountries';

//importing notification library
import Notiflix from 'notiflix';

//importing debounce function from lodash library
import debounce from 'lodash.debounce';

//creating and initializing variable for debounce 
const DELAY = 300;

//creating and initializing object with links on page elements (input box, country list, country info)
const refs = {
    "countryInput": document.querySelector("#search-box"),
    "countryList": document.querySelector(".country-list"),
    "countryInfo": document.querySelector(".country-info")
}

//setting up event listiner for input
refs.countryInput.addEventListener('input', debounce(onCountryInputHandler, DELAY));

//defining handler for input
function onCountryInputHandler() {
    //console.log("I'm here");
  const name = refs.countryInput.value.trim();
  if (name === '') {
    return (refs.countryList.innerHTML = ''), (refs.countryInfo.innerHTML = '');
  }

  fetchCountries(name)
    .then(countriesList => {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
    
      if (countriesList.length === 1) {
        
        updateCountriesList(countriesList, refs.countryList);
        updateCountriesInfo(countriesList, refs.countryInfo);

      } else if (countriesList.length >= 10) {

        warningTooMany();

      } else {

        updateCountriesList(countriesList, refs.countryList);
      }
    })
    .catch(warningNoCountry);
}


//defining function for updating countries list
function updateCountriesList(countriesList, htmlElement) {
  const element = countriesList
    .map(({ name, flags }) => {
      return `
            <li class="country-list__item" style="list-style-type: none; display: flex; align-items:center">
                <img style = "display: inline-block" class="country-list__flag" src="${flags.svg}" alt="The flag of ${name.official}" width = 100 height = 100px>
                <h2 class="country-list__name">${name.official}</h2>
            </li>
            `;
    })
    .join('');

    htmlElement.insertAdjacentHTML('beforeend', element);
}

//defining function for updating country's info
function updateCountriesInfo(countriesList, htmlElement) {
  const element = countriesList
    .map(({ capital, population, languages }) => {
      return `
          <ul class="country-info__list" style="list-style-type: none">
              <li class="country-info__capital"><p>Сapital: ${capital}</p></li>
              <li class="country-info__population"><p>Population: ${population}</p></li>
              <li class="country-info__languages"><p>Languages: ${Object.values(languages).join(
                '; ',
              )}</p></li>
          </ul>
          `;
    })
    .join('');

  htmlElement.insertAdjacentHTML('beforeend', element);
}

//defining function for notification if unable to find a country
function warningNoCountry() {
  Notiflix.Notify.failure('Sorry, there is no country with such name');
}

//defining function for notification if search result exeedes a limit
function warningTooMany() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}


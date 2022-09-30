/*library connection*/
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

/*importing own functions*/
import './css/styles.css';
import { createGallery } from './js/createGallery';
import { cleanGallery } from './js/createGallery';
import { getImages } from './js/getImages';

/*variables */

/*creating instanse of simplelightbox instance*/
let simplelightbox = new SimpleLightbox ('.gallery a', {
  nav: true,
  close: true,
  caption: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});;

/*for search reasons*/
let currentSearch = {
  page: 1,
  phrase: '',
  totalHits: 0,
  resultsPerPage: 40,
  nowDisplayed: 0
};

/*document elements*/
const refs = {
  gallery: document.querySelector('.gallery'),
  btnSearch: document.querySelector('#search-form'),
  btnLoadMore: document.querySelector('.load-more'),
};

//adding event listiner on search button
refs.btnSearch.addEventListener('submit', clickOnBtnSearchHandler);

//adding event listiner on loadMore button
refs.btnLoadMore.addEventListener('click', clickOnBtnLoadMoreHandler);

/*defining function for getting images without gallery creation*/ 
async function getImgWithOutGalleryCreation(searchString, page, perPage) {
  const { data } = await getImages(searchString, page, perPage);
  currentSearch.totalHits = data.totalHits;
  currentSearch.nowDisplayed = page*perPage;
  return data.hits;
}

/*defining clickOnBtnSearchHandler function*/

function clickOnBtnSearchHandler(event) {
  event.preventDefault();
  cleanGallery(refs.gallery);
  refs.btnLoadMore.classList.add('js-is-hidden');
  currentSearch.page = 1;
  currentSearch.nowDisplayed = 0;

  currentSearch.phrase = event.currentTarget.searchQuery.value.trim();
  //console.log('in button search handler  ' + currentSearch.phrase);

  if (currentSearch.phrase === '') {
    return warningEmptySearch();
  }

  //refs.btnLoadMore.classList.remove('js-is-hidden');
  getImgWithOutGalleryCreation(
    currentSearch.phrase,
    currentSearch.page,
    currentSearch.resultsPerPage
  )
    .then(data => {
      createGallery(data, refs.gallery);
      if(currentSearch.totalHits>currentSearch.nowDisplayed){
        //console.log('totalHits: '+ currentSearch.totalHits + ' now displayed: '+ currentSearch.nowDisplayed);
        refs.btnLoadMore.classList.remove('js-is-hidden');
      }
      simplelightbox.refresh();
    })
    .then(() => {
      if (currentSearch.totalHits === 0) {
        refs.btnLoadMore.classList.add('js-is-hidden');
        return warningNoResults();
      }
    })
    .catch(error => console.log(error));
}

/*defining clickOnBtnLoadMoreHandler function*/
function clickOnBtnLoadMoreHandler(event) {
  if (currentSearch.totalHits > currentSearch.nowDisplayed) {
    currentSearch.page += 1;
    //console.log('in button load more handler  ' + currentSearch.phrase);
    getImgWithOutGalleryCreation(
      currentSearch.phrase,
      currentSearch.page,
      currentSearch.resultsPerPage
    ).then(data => {
      createGallery(data, refs.gallery);
      if(currentSearch.totalHits<currentSearch.nowDisplayed){
        //console.log('totalHits: '+ currentSearch.totalHits + ' now displayed: '+ currentSearch.nowDisplayed);
        refs.btnLoadMore.classList.add('js-is-hidden');
      }
      simplelightbox.refresh();
    })
    .catch(error => console.log(error));
  } else {
    refs.btnLoadMore.classList.add('js-is-hidden');
    return warningNoMoreResults();
  }
}

/*notification functions*/
function warningEmptySearch() {
  Notiflix.Notify.failure('Please enter a word or phrase for searchig!');
}

function warningNoResults() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function warningNoMoreResults() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
  }
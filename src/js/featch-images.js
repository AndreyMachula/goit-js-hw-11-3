import imageCard from '../templates/card-layout-template.hbs'
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import API from './api-service.js'; 
import getRefs from './get-refs';
import LoadMoreBtn from './btn-load-more';
import ERROR from './featch-error.js';

const refs = getRefs();


// let lightbox = new SimpleLightbox('.photo-card a', {
//   captions: true,
//   captionsData: 'alt',
//   captionDelay: 250,
// })
// function getRefs() {
//   return {
//     searchForm: document.getElementById('search-form'),
//     searchQuery: document.querySelector('[name="searchQuery"]'),
//     submitBtn: document.querySelector('[type="submit"]'),
//     imagesCardsGallery: document.querySelector('.gallery'),
//   };   

const searchImages = new API();
console.log(searchImages); 

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
//===================================================================
function onSearch(e) {
  e.preventDefault();
  
  searchImages.query = refs.searchQuery.value.trim();
  searchImages.resetPage();
  
  console.log(searchImages.page)
  
  if (searchImages === '') {
    e.currentTarget.reset();
    ERROR();
    loadMoreBtn.disable();
  }
  
  searchImages.featchImages().then(images => {
    if (images.hits.length === 0) {
      ERROR();
      loadMoreBtn.hide();
    } else if (images.hits.length >= 40) {
      loadMoreBtn.show();
      cleareContent();
      renderImagesCard(images);
      lightbox.refresh('show.simpleLightbox');
      Notify.success(`Hooray! We found ${images.totalHits} images.`);
    }
    
    console.log(images);
  
  })
  
  e.currentTarget.reset();
  scroll();
};
//============================================================================
async function renderImagesCard(images) {
    const markup = await imageCard(images.hits);

    refs.imagesCardsGallery.insertAdjacentHTML("beforeend", markup);
  if (images.hits.length < 40 && images.hits.length >= 1) {
      // lightbox.refresh()
      loadMoreBtn.hide();   
      onFetchInfo();
    } 
    lightbox.refresh('show.simpleLightbox');
}

function scroll() {
    let scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight
    );

    window.scrollBy({
    top: scrollHeight * -2,
    behavior: "auto",
    });
} 

function cleareContent() {
    refs.imagesCardsGallery.innerHTML = '';
};

function onLoadMore() {
    loadMoreBtn.disable();
    searchImages.fetchImages().then(images => {
        renderImagesCard(images);
        loadMoreBtn.enable(); 
    });  
}
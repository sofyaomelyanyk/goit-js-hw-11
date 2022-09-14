import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewApiService from './js/fetchCards';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkupCars } from './js/createMarkup';

const formSubmit = document.querySelector('#search-form');
const buttonLoadMore = document.querySelector('.js-load');
const gallery = document.querySelector('.gallery');

formSubmit.addEventListener('submit', onSubmitForm);
buttonLoadMore.addEventListener('click', onInput);

const newApiService = new NewApiService();

var lightbox = new SimpleLightbox('.gallery a', {
  navText: ['&#129040;', '&#129042;'],
});

function onSubmitForm(e) {
  e.preventDefault();

  buttonLoadMore.classList.add('is-hidden');

  newApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  if (!newApiService.query) {
    return;
  }

  newApiService.resetPage();
  newApiService.fetchCards().then(cards => {
    clearCards();
    appendCards(cards);

    if (cards.hits.length) {
      buttonLoadMore.classList.remove('is-hidden');
      Notify.success(`Hooray! We found ${cards.totalHits} images.`);
      return;
    }
    if (!cards.hits.length) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
  });
}

function onInput() {
  newApiService.fetchCards().then(cards => {
    appendCards(cards);

    const diff = Math.floor(cards.totalHits / newApiService.page);

    if (newApiService.page >= diff) {
      buttonLoadMore.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
  });
}

function appendCards({ hits, totalHits }) {
  gallery.insertAdjacentHTML('beforeend', createMarkupCars(hits, totalHits));
  lightbox.refresh();
}

function clearCards() {
  gallery.innerHTML = '';
}

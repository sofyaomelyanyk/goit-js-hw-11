import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import NewApiService from './js/fetchCards';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createMarkupCars } from './js/createMarkup';

const newApiService = new NewApiService();
new SimpleLightbox('.gallery a', {
  navText: ['&#129040;', '&#129042;'],
});

const formSubmit = document.querySelector('#search-form');
const buttonLoadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

formSubmit.addEventListener('submit', onSubmitForm);
buttonLoadMore.addEventListener('click', onInput);

function onSubmitForm(e) {
  e.preventDefault();

  newApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  if (!newApiService.query) {
    return;
  }

  newApiService.resetPage();
  newApiService.fetchCards().then(cards => {
    clearCards();
    appendCards(cards);
    buttonLoadMore.removeAttribute('hidden');
    if (cards.hits.length) {
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
  });
}

function appendCards({ hits, totalHits }) {
  gallery.insertAdjacentHTML('beforeend', createMarkupCars(hits, totalHits));
}

function clearCards() {
  gallery.innerHTML = '';
}

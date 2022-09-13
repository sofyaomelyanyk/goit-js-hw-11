import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewApiService from './js/fetchCards';
import axios from 'axios';
import { createMarkupCars } from './js/createMarkup';

//  1) Пользователь будет вводить строку для поиска в текстовое поле,
//  а при сабмите формы необходимо выполнять HTTP-запрос.

// 2) В ответе будет массив изображений удовлетворивших критериям параметров запроса.

// 3) Если бэкенд возвращает пустой массив, показывай уведомление с текстом
//  "Sorry, there are no images matching your search query. Please try again."

// 4)  При поиске по новому ключевому слову необходимо полностью очищать содержимое галереи,
//  чтобы не смешивать результаты.

// 5)Изначально значение параметра page должно быть 1.

// 6)При каждом последующем запросе, его необходимо увеличить на 1.

// 7)При поиске по новому ключевому слову значение page надо вернуть в исходное,
//  так как будет пагинация по новой коллекции изображений.

// 8)При клике на кнопку необходимо выполнять запрос
// за следующей группой изображений
// и добавлять разметку к уже существующим элементам галереи.

const formSubmit = document.querySelector('#search-form');
const buttonLoadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

var lightbox = new SimpleLightbox('.gallery a', {
  navText: ['&#129040;', '&#129042;'],
});

const newApiService = new NewApiService();

formSubmit.addEventListener('submit', onSubmitForm);
buttonLoadMore.addEventListener('click', onInput);

function onSubmitForm(e) {
  e.preventDefault();

  newApiService.query = e.currentTarget.elements.searchQuery.value;
  newApiService.resetPage();
  newApiService.fetchCards().then(appendCards);
}

function onInput() {
  newApiService.fetchCards().then(appendCards);
}

function appendCards(hits) {
  gallery.insertAdjacentHTML('beforeend', createMarkupCars(hits));
  lightbox.refresh();
}

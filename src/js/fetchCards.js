export default class NewApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchCards() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '29900249-f408e73867b1f38cfd16b3d88';
    const searchParams =
      'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

    return fetch(
      `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`
    )
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(({ hits, totalHits }) => {
        this.incrementPage();
        //   console.dir(hits);
        //   console.dir(totalHits);

        return { hits, totalHits };
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

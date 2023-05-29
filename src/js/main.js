import Notiflix from 'notiflix';
import { searchImages } from './api.js';
import { renderImages } from './gallery.js';

// Оголошення змінних для пагінації
let perPage = 40;
let currentPage = 1;

// Отримання посилань на елементи DOM
const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('input[name="searchQuery"]');
const loadMoreButton = document.querySelector('.load-more');
const galleryElement = document.querySelector('.gallery');

// Функція для очищення галереї
function clearGallery() {
  galleryElement.innerHTML = '';
}

// Функція для відображення повідомлення про кінець результатів пошуку
function showEndOfResultsMessage() {
  loadMoreButton.style.display = 'none';

  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

// Функція для відображення повідомлення про кількість знайдених зображень
function showTotalHitsMessage(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

// Обробник події для форми пошуку
async function handleSearch(event) {
  event.preventDefault();

  const searchQuery = searchInput.value;

  try {
    clearGallery();

    const { hits, totalHits } = await searchImages(searchQuery, 1);

    if (hits.length > 0) {
      renderImages(hits);

      // Перевірка наявності наступних результатів для пагінації
      if (totalHits > perPage) {
        showLoadMoreButton();
        currentPage = 1;
      } else {
        hideLoadMoreButton();
      }

      showTotalHitsMessage(totalHits);
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      hideLoadMoreButton();
    }
  } catch (error) {
    Notiflix.Notify.failure('Error fetching images. Please try again later.');
    hideLoadMoreButton();
  }
}

searchForm.addEventListener('submit', handleSearch);

// Функція для відображення кнопки "Load more"
function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}

// Функція для приховування кнопки "Load more"
function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}

hideLoadMoreButton();

// Обробник події для кнопки "load-more"
async function handleLoadMore() {
  const searchQuery = searchInput.value;

  try {
    const { hits, totalHits } = await searchImages(
      searchQuery,
      currentPage + 1
    );

    if (hits.length > 0) {
      renderImages(hits);
      currentPage++;

      if (currentPage * perPage >= totalHits) {
        showEndOfResultsMessage();
      }
    } else {
      showEndOfResultsMessage();
    }

    // Отримання висоти нового зображення
    const cardHeight = document
      .querySelector('.gallery')
      .lastElementChild.getBoundingClientRect().height;

    // Прокручування нового зображення до вказаної висоти
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    Notiflix.Notify.failure('Error fetching images. Please try again later.');
  }
}

document.querySelector('.load-more').addEventListener('click', handleLoadMore);

// Реалізуємо фіксацію шапки при скролі
const searchFormOffsetTop = searchForm.offsetTop;

function handleScrollHeader() {
  const scrollPosition = window.pageYOffset;

  if (scrollPosition >= searchFormOffsetTop) {
    searchForm.classList.add('fixed');
  } else {
    searchForm.classList.remove('fixed');
  }
}

window.addEventListener('scroll', handleScrollHeader);

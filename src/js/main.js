import Notiflix from 'notiflix';
import { searchImages } from './api.js';
import { renderImages } from './gallery.js';

// Оголошення змінних для пагінації
const perPage = 40;
let currentPage = 1;

// Функція для очищення галереї
function clearGallery() {
  const galleryElement = document.querySelector('.gallery');
  galleryElement.innerHTML = '';
}

// Функція для відображення повідомлення про кінець результатів пошуку
function showEndOfResultsMessage() {
  const loadMoreButton = document.querySelector('.load-more');
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
document
  .getElementById('search-form')
  .addEventListener('submit', async event => {
    event.preventDefault();

    const searchQuery = document.querySelector(
      'input[name="searchQuery"]'
    ).value;

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
  });

// Функція для відображення кнопки "Load more"
function showLoadMoreButton() {
  const loadMoreButton = document.querySelector('.load-more');
  loadMoreButton.style.display = 'block';
}

// Функція для приховування кнопки "Load more"
function hideLoadMoreButton() {
  const loadMoreButton = document.querySelector('.load-more');
  loadMoreButton.style.display = 'none';
}

// Приховання кнопки "Load more" при запуску
hideLoadMoreButton();

// Функція, яка буде виконуватися при прокручуванні сторінки
function handleScroll() {
  const scrollPosition = window.pageYOffset;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Перевіряємо, чи досягнута нижня частина сторінки після завантаження нових зображень
  if (scrollPosition + windowHeight >= documentHeight - 100) {
    const loadMoreButton = document.querySelector('.load-more');
    loadMoreButton.style.display = 'block';
  }
}

window.addEventListener('scroll', handleScroll);

// Обробник події для кнопки "load-more"
document.querySelector('.load-more').addEventListener('click', async () => {
  const searchQuery = document.querySelector('input[name="searchQuery"]').value;

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
});

// Реалізуємо фіксацію шапки при скролі
const searchForm = document.getElementById('search-form');
const searchFormOffsetTop = searchForm.offsetTop;

function handleScroll() {
  const scrollPosition = window.pageYOffset;

  if (scrollPosition >= searchFormOffsetTop) {
    searchForm.classList.add('fixed');
  } else {
    searchForm.classList.remove('fixed');
  }
}

window.addEventListener('scroll', handleScroll);

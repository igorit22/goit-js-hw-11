import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '36697447-2a4d8e47928b599bac08c066e';
const perPage = 40;
let currentPage = 1;

// Функція для виконання запиту та отримання зображень
async function searchImages(query, page) {
  try {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    const response = await axios.get(url);
    const { hits, totalHits } = response.data;

    return { hits, totalHits };
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

// Функція для рендерингу зображень
function renderImages(images) {
  const galleryElement = document.querySelector('.gallery');

  images.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const imgElement = document.createElement('img');
    imgElement.src = image.webformatURL;
    imgElement.alt = image.tags;
    imgElement.loading = 'lazy';

    const aElement = document.createElement('a');
    aElement.href = image.largeImageURL;
    aElement.setAttribute('data-lightbox', 'gallery');

    const infoElement = document.createElement('div');
    infoElement.classList.add('info');
    infoElement.innerHTML = `<p class="info-item"><b>Likes</b> ${image.likes}</p>
                             <p class="info-item"><b>Views</b> ${image.views}</p>
                             <p class="info-item"><b>Comments</b> ${image.comments}</p>
                             <p class="info-item"><b>Downloads</b> ${image.downloads}</p>`;

    aElement.appendChild(imgElement);
    photoCard.appendChild(aElement);
    photoCard.appendChild(infoElement);

    galleryElement.appendChild(photoCard);

    function playNextImageGroup() {
      // Виконати логіку відтворення наступної групи зображень

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 0.6,
        behavior: 'smooth',
      });
    }
    // Викликати функцію після відтворення кожної наступної групи зображень
    playNextImageGroup();
  });

  // Оновлення галереї після додавання нових зображень
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

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

// Обробник події для кнопки "Load more"
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
  } catch (error) {
    Notiflix.Notify.failure('Error fetching images. Please try again later.');
  }
});

// Отримуємо елемент форми за його ідентифікатором
const searchForm = document.getElementById('search-form');

// Отримуємо відстань елементу форми від верхньої частини сторінки
const searchFormOffsetTop = searchForm.offsetTop;

// Функція, яка буде виконуватися при прокручуванні сторінки
function handleScroll() {
  // Отримуємо поточну позицію прокрутки
  const scrollPosition = window.pageYOffset;

  // Перевіряємо, чи прокрутили сторінку вниз досить далеко
  if (scrollPosition >= searchFormOffsetTop) {
    // Якщо так, додаємо клас "fixed" до елементу форми
    searchForm.classList.add('fixed');
  } else {
    // Якщо ні, видаляємо клас "fixed" з елементу форми
    searchForm.classList.remove('fixed');
  }
}

// Додаємо обробник події "scroll" до вікна
window.addEventListener('scroll', handleScroll);

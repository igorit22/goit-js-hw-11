import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Функція для рендерингу зображень
export function renderImages(images) {
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
  });

  // Оновлення галереї після додавання нових зображень
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

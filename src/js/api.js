import axios from 'axios';

const apiKey = '36697447-2a4d8e47928b599bac08c066e';
const perPageApi = 40;

// Функція для виконання запиту та отримання зображень
export async function searchImages(query, page) {
  try {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPageApi}`;

    const response = await axios.get(url);
    const { hits, totalHits } = response.data;

    return { hits, totalHits };
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

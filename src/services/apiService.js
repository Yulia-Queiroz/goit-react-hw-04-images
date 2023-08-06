import axios from 'axios';
const API_KEY = '36721140-5d149307ee8e007662db15b3c';

export const getImages = async (query, page) => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
    );
    if (response.status === 200) {
      const images = response.data.hits;
      if (images.length === 0) {
        return Promise.reject(new Error('No images found.'));
      }
      return response.data;
    } else {
      return Promise.reject(new Error('No images found.'));
    }
  } catch (error) {
    throw error;
  }
};

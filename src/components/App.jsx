import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import { getImages } from '../services/apiService';
import ErrorMessage from './ErrorMessage';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  const handleFormSubmit = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
    setLoading(true);
    setError(null);
    setLoadMore(false);
  };

  const onLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onOpenModal = image => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!query) {
      return;
    }

    getImages(query, page)
      .then(fetchedImages => {
        setImages(prevImages => [...prevImages, ...fetchedImages.hits]);
        setLoading(false);
        setLoadMore(page < Math.ceil(fetchedImages.totalHits / 12));
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [query, page]);

  return (
    <>
      <Searchbar onSubmit={handleFormSubmit}></Searchbar>
      {showModal && (
        <Modal
          link={selectedImage.largeImageURL}
          tags={selectedImage.tags}
          closeModal={onCloseModal}
        />
      )}
      {loading && <Loader />}
      {error && <ErrorMessage error={error} />}

      <ImageGallery images={images} onImgClick={onOpenModal} />
      {loadMore && <Button onLoadMore={onLoadMore} />}

      <ToastContainer />
    </>
  );
};

export default App;

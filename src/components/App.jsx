import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import { getImages } from '../services/apiService';
import ErrorMessage from './ErrorMessage';

export default class App extends Component {
  state = {
    query: '',
    page: 1,
    images: [],
    loading: false,
    error: null,
    selectedImage: null,
    showModal: false,
    loadMore: false,
  };

  handleFormSubmit = query => {
    this.setState({
      query,
      page: 1,
      images: [],
      loading: true,
      error: null,
      loadMore: false,
    });
  };

  onLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  onOpenModal = image => {
    this.setState({
      selectedImage: image,
      showModal: true,
    });
  };

  onCloseModal = () => {
    this.setState({ showModal: false });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.page !== prevState.page ||
      this.state.query !== prevState.query
    ) {
      getImages(this.state.query, this.state.page)
        .then(images => {
          this.setState(prevState => ({
            images: [...prevState.images, ...images.hits],
            loading: false,
            loadMore: this.state.page < Math.ceil(images.totalHits / 12),
          }));
        })
        .catch(error => {
          this.setState({
            error,
            loading: false,
          });
        });
    }
  }

  render() {
    const { selectedImage, error, images, loadMore, showModal, loading } =
      this.state;
    return (
      <>
        <Searchbar onSubmit={this.handleFormSubmit}></Searchbar>
        {showModal && (
          <Modal
            link={selectedImage.largeImageURL}
            tags={selectedImage.tags}
            closeModal={this.onCloseModal}
          />
        )}
        {loading && <Loader />}
        {error && <ErrorMessage error={error} />}

        <ImageGallery images={images} onImgClick={this.onOpenModal} />
        {loadMore && <Button onLoadMore={this.onLoadMore} />}

        <ToastContainer />
      </>
    );
  }
}

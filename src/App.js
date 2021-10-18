import React, { useState, useEffect } from "react";
import { fetchImages } from "./shared/services/postsGallery";
import LoaderComponent from "./components/loader/Loader.jsx";
import ErrorNotification from "./components/errorNotification/ErrorNotification.jsx";
import SearchBar from "./components/searchBar/SearchBar.jsx";
import ImageGallery from "./components/imageGallery/ImageGallery.jsx";
import ImageGalleryItem from "./components/imageGalleryItem/ImageGalleryItem.jsx";
import Button from "./components/button/Button.jsx";
import Modal from "./components/modal/Modal.jsx";
import "./Styles.css";

const initialState = {
  images: [],
  isLoading: false,
  isModal: false,
  error: null,
  query: "",
  page: 1,
  largeImageURL: "",
};

const App = () => {
  const [state, setState] = useState(initialState);

  const handleSubmit = (inputValue) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      query: inputValue,
      images: [],
      page: 1,
    }));
  };

  const getDataImages = (query, page) => {
    fetchImages(query, page)
      .then(({ data }) => {
        const imagesDataArr = data.hits.map((image) => {
          const { id, webformatURL, largeImageURL } = image;
          return { id, webformatURL, largeImageURL };
        });
        setState((prevState) => ({
          ...prevState,
          images: [...prevState.images, ...imagesDataArr],
          page: prevState.page + 1,
          isLoading: false,
          error: null,
        }));
      })
      .then(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      })
      .catch((error) =>
        setState((prevState) => ({ ...prevState, error, isLoading: false }))
      );
  };

  useEffect(() => {
    const { query, page, isLoading } = state;
    if (isLoading) {
      getDataImages(query, page);
    }
  }, [state.isLoading]);

  const onButtonClick = () => {
    setState((prevState) => ({ ...prevState, isLoading: true }));
  };

  const onOpenModal = (image) => {
    setState((prevState) => ({
      ...prevState,
      largeImageURL: image,
      isModal: true,
    }));
  };

  const onCloseModal = (e) => {
    if (e && e.target.id !== "overlay") {
      return null;
    }
    setState((prevState) => ({ ...prevState, isModal: false }));
  };

  const { error, isLoading, images, query, largeImageURL, isModal } = state;

  return (
    <div className="App">
      <SearchBar onSubmit={handleSubmit} />
      {images.length > 0 && (
        <ImageGallery>
          {images.length > 0 && (
            <ImageGalleryItem
              images={images}
              query={query}
              onOpenModal={onOpenModal}
            />
          )}
        </ImageGallery>
      )}
      {isModal && (
        <Modal onClose={onCloseModal}>
          <img src={largeImageURL} alt={query} />
        </Modal>
      )}
      {error && <ErrorNotification text={error.message} />}
      {isLoading && <LoaderComponent />}
      {images.length > 0 && <Button onClick={onButtonClick} />}
    </div>
  );
};

export default App;

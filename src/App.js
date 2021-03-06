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

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [largeImageURL, setLargeImageURL] = useState("");

  const handleSubmit = (inputValue) => {
    setIsLoading(true);
    setQuery(inputValue);
    setImages([]);
    setPage(1);
  };

  const getDataImages = (query, page) => {
    fetchImages(query, page)
      .then(({ data }) => {
        const imagesDataArr = data.hits.map((image) => {
          const { id, webformatURL, largeImageURL } = image;
          return { id, webformatURL, largeImageURL };
        });
        setImages([...images, ...imagesDataArr]);
        setPage(page + 1);
        setIsLoading(false);
        setError(null);
      })
      .then(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isLoading) {
      getDataImages(query, page);
    }
  }, [isLoading]);

  const onButtonClick = () => {
    setIsLoading(true);
  };

  const onOpenModal = (image) => {
    setLargeImageURL(image);
    setIsModal(true);
  };

  const onCloseModal = (e) => {
    if (e && e.target.className !== "Overlay") {
      return null;
    }
    setIsModal(false);
  };

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

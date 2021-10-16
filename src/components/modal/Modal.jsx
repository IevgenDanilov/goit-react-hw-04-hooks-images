import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Modal = ({ onClose, children }) => {
  useEffect(() => {
    window.addEventListener("keydown", closeModal);
    return () => {
      window.removeEventListener("keydown", closeModal);
    };
  });

  const closeModal = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="Overlay" onClick={onClose}>
      <div className="Modal">{children}</div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

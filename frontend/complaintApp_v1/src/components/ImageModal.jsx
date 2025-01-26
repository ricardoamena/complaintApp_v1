import React, { useEffect } from "react";
import PropTypes from "prop-types";

const ImageModal = ({ imageUrl, onClose }) => {
  console.log("ImageModal renderizado con URL:", imageUrl);

  //Desactivar scroll cuando se muestra el modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  //Cerrar modal al presionar la tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-4xl max-h-[90vh] mx-4 bg-white p-2 rounded-lg"
      onClick={(e) => e.stopPropagation()}
      >
        onClick={(e) => e.stopPropagation()}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-xl p-2 hover:text-gray-300"
          aria-label="Cerrar imagen"
        >
          ✕ Cerrar
        </button>
        <div className="overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt="Vista ampliada"
            className="max-h-[85vh] w-auto object-contain"
            onClick={(e) => e.stopPropagation()}
            
          />
        </div>
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageModal;
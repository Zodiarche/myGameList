import React from 'react';
import useModal from '../../hooks/useModal';

/**
 * Composant générique pour afficher une boîte de dialogue modale.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {boolean} props.show - Indique si le modal est visible ou non.
 * @param {function} props.onClose - Fonction appelée pour fermer le modal.
 * @param {React.ReactNode} props.children - Les éléments à afficher à l'intérieur du modal.
 * @param {string} props.title - Le titre affiché en haut du modal.
 * @returns {JSX.Element|null}
 */
const ModalWrapper = ({ show, onClose, children, title }) => {
  const modalRef = useModal(show, onClose);

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal__content" ref={modalRef}>
        <span className="modal__close" onClick={onClose}>
          &times;
        </span>
        <h2 className="modal__title">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;

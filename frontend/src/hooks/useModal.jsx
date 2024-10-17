import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer l'affichage et la fermeture d'un modal.
 *
 * @param {boolean} show - Indique si le modal est affiché.
 * @param {function} onClose - Fonction appelée pour fermer le modal.
 * @returns {Object} Référence à l'élément DOM du modal.
 */
const useModal = (show, onClose) => {
  const modalRef = useRef(null);

  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const root = document.querySelector('#root');
    root.classList.toggle('active', show);

    return () => root.classList.remove('active');
  }, [show]);

  useEffect(() => {
    if (!show) return;

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, handleClickOutside]);

  return modalRef;
};

export default useModal;

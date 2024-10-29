import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';

const ModalAddNote = ({ show, onClose, onSubmit }) => {
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [etat, setEtat] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ note, etat, commentaire });
    onClose();
  };

  return (
    <ModalWrapper show={show} onClose={onClose} title="Ajouter ce jeu à votre bibliothèque">
      <form className="modal__form" onSubmit={handleSubmit}>
        <div className="modal__field-container">
          <div className="modal__field">
            <label className="modal__label">Note (sur 5) :</label>
            <input className="modal__input" type="number" value={note} min="0" max="5" onChange={(event) => setNote(event.target.value)} />
          </div>

          <div className="modal__field">
            <label className="modal__label">État :</label>
            <select className="modal__select" value={etat} onChange={(event) => setEtat(event.target.value)}>
              <option value={0}>À jouer</option>
              <option value={1}>En cours</option>
              <option value={2}>Abandonné</option>
              <option value={3}>Terminé</option>
            </select>
          </div>
        </div>

        <div className="modal__field">
          <label className="modal__label">Commentaire :</label>
          <textarea className="modal__textarea" rows={5} value={commentaire} onChange={(event) => setCommentaire(event.target.value)} />
        </div>

        <button className="modal__submit" type="submit">
          Ajouter à ma bibliothèque
        </button>
      </form>
    </ModalWrapper>
  );
};

export default ModalAddNote;

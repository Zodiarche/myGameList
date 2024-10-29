import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import ModalWrapper from './ModalWrapper';
import { deleteGameUser } from '../../services/api';

const ModalEditUserGame = ({ show, onClose, onSubmit, game }) => {
  const [commentaire, setCommentaire] = useState(game?.commentaire || '');
  const [note, setNote] = useState(game?.note || 0);
  const [etat, setEtat] = useState(game?.etat || 0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (game) {
      setNote(game.note || 0);
      setCommentaire(game.commentaire || '');
      setEtat(game.etat || 0);
    }
  }, [game]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ note, etat, commentaire });
    onClose();
  };

  const handleDeleteGame = async () => {
    try {
      if (!game && !game?._id) return;

      await deleteGameUser(game._id);
      queryClient.removeQueries(['gameUsers']);
      queryClient.setQueryData(['gameUsers'], null);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression du jeu:', error);
    }
  };

  return (
    <ModalWrapper show={show} onClose={onClose} title="Modifier votre avis !">
      <form className="modal__form" onSubmit={handleSubmit}>
        <div className="modal__field modal__field--flex">
          <p className="modal__description">Votre note :</p>
          <div className="modal__radio">
            {[1, 2, 3, 4, 5].map((value) => (
              <React.Fragment key={value}>
                <input id={`note-${value}`} type="radio" name="note" value={value} checked={note === value} onChange={() => setNote(value)} />
                <label htmlFor={`note-${value}`}>{value}</label>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="modal__field">
          <div className="modal__radio">
            {[
              { value: 0, label: 'À jouer' },
              { value: 1, label: 'En cours' },
              { value: 2, label: 'Abandonné' },
              { value: 3, label: 'Terminé' },
            ].map(({ value, label }) => (
              <React.Fragment key={value}>
                <input id={`etat-${value}`} type="radio" name="etat" value={value} checked={etat === value} onChange={() => setEtat(value)} />
                <label htmlFor={`etat-${value}`}>{label}</label>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="modal__field">
          <label className="modal__label">Commentaire :</label>
          <textarea className="modal__textarea" rows={5} value={commentaire} onChange={(event) => setCommentaire(event.target.value)} />
        </div>

        <button className="modal__submit" type="submit">
          Mettre à jour
        </button>
      </form>

      <button className="modal__delete" onClick={handleDeleteGame}>
        Supprimer le jeu
      </button>
    </ModalWrapper>
  );
};

export default ModalEditUserGame;

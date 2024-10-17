import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

import { normalizeString } from '../utils/normalizeString';
import { fetchGamesBySearch } from '../services/api';

import { ModalWrapper } from './ModalWrapper';

export const ModalSearchGame = memo(({ show, onClose }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: games,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['games', searchQuery],
    queryFn: () => fetchGamesBySearch(normalizeString(searchQuery)),
    enabled: false,
  });

  const debouncedSearch = useCallback(
    debounce(() => {
      if (!searchQuery.trim()) return;
      refetch();
    }, 300),
    [searchQuery, refetch]
  );

  useEffect(() => debouncedSearch(), [searchQuery, debouncedSearch]);

  const handleClearSearch = useCallback(() => setSearchQuery(''), []);
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') debouncedSearch();
    },
    [debouncedSearch]
  );

  const renderStates = () => {
    if (isLoading) return <p className="states__highlight">Votre recherche est en cours...</p>;
    if (error) return <p className="states__error">Une erreur est survenue durant la recherche.</p>;
    if (!games || games.length === 0) return <p className="states__info">Aucun résultat.</p>;

    return null;
  };

  const renderGames = () => {
    if (!games || games.length === 0) return null;

    return games.map((game) => (
      <div key={game._id} className="modal__game-item" onClick={() => navigate(`/games/${game._id}`)}>
        <p>{game.name}</p>
      </div>
    ));
  };

  return (
    <ModalWrapper show={show} onClose={onClose} title="Rechercher vos jeux">
      <div className="modal__search-input-container">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Entrez le nom du jeu..." />
        {searchQuery && (
          <button onClick={handleClearSearch} className="modal__clear-button">
            ❌
          </button>
        )}
      </div>

      {renderStates()}

      <div className="modal__results">{renderGames()}</div>
    </ModalWrapper>
  );
});

export const ModalAddNote = memo(({ show, onClose, onSubmit }) => {
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [etat, setEtat] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ note, etat, commentaire });
    onClose();
  };

  return (
    <ModalWrapper show={show} onClose={onClose} title="Ajouter une note au jeu">
      <form onSubmit={handleSubmit}>
        <label>
          Note (sur 5) :
          <input type="number" value={note} min="0" max="5" onChange={(event) => setNote(event.target.value)} />
        </label>
        <label>
          État :
          <select value={etat} onChange={(event) => setEtat(event.target.value)}>
            <option value={0}>À jouer</option>
            <option value={1}>En cours</option>
            <option value={2}>Abandonné</option>
            <option value={3}>Terminé</option>
          </select>
        </label>
        <label>
          Commentaire :
          <textarea value={commentaire} onChange={(event) => setCommentaire(event.target.value)} />
        </label>
        <button type="submit">Ajouter à ma collection</button>
      </form>
    </ModalWrapper>
  );
});

export const ModalEditGame = ({ show, onClose, onSubmit, game }) => {
  const [note, setNote] = useState(game?.note || 0);
  const [commentaire, setCommentaire] = useState(game?.commentaire || '');
  const [etat, setEtat] = useState(game?.etat || 0);

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

  return (
    <ModalWrapper show={show} onClose={onClose} title="Modifier les informations du jeu">
      <form onSubmit={handleSubmit}>
        <label>
          Note (sur 5) :
          <input type="number" value={note} min="0" max="5" onChange={(event) => setNote(event.target.value)} />
        </label>
        <label>
          État :
          <select value={etat} onChange={(event) => setEtat(event.target.value)}>
            <option value={0}>À jouer</option>
            <option value={1}>En cours</option>
            <option value={2}>Abandonné</option>
            <option value={3}>Terminé</option>
          </select>
        </label>
        <label>
          Commentaire :
          <textarea value={commentaire} onChange={(event) => setCommentaire(event.target.value)} />
        </label>
        <button type="submit">Mettre à jour</button>
      </form>
    </ModalWrapper>
  );
};

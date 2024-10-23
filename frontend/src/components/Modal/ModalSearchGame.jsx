import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

import ModalWrapper from './ModalWrapper';

import { normalizeString } from '../../utils/normalizeString';
import { fetchGamesBySearch } from '../../services/api';

const ModalSearchGame = ({ show, onClose, onSelectGame, isForDeletion = false, isForEditing = false }) => {
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
  const handleGameClick = (game) => {
    if (isForDeletion) {
      onSelectGame(game._id, refetch);
    } else if (isForEditing) {
      onSelectGame(game);
    } else {
      navigate(`/games/${game._id}`);
    }
  };

  const renderGames = () => {
    if (!games || games.length === 0) return null;

    return games.map((game) => (
      <div key={game._id} className="modal__game-item" onClick={() => handleGameClick(game)}>
        <p>{game.name}</p>
      </div>
    ));
  };

  return (
    <ModalWrapper show={show} onClose={onClose} title={isForDeletion ? 'Supprimer un jeu' : 'Rechercher vos jeux'}>
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
};

export default ModalSearchGame;

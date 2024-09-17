import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { normalizeString } from '../utils/normalizeString';
import Loading from './Loading';

const fetchGames = async (searchQuery) => {
  const response = await fetch(
    `http://localhost:3000/games/search?search=${encodeURIComponent(searchQuery)}`
  );
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des jeux');
  }

  return response.json();
};

const Modal = memo(({ show, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef(null);

  const {
    data: games,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['games', searchQuery],
    queryFn: () => fetchGames(normalizeString(searchQuery)),
    enabled: false,
  });

  const debouncedSearch = useCallback(
    debounce(() => {
      if (searchQuery.trim()) {
        refetch();
      }
    }, 300),
    [searchQuery, refetch]
  );

  useEffect(() => {
    debouncedSearch();
  }, [searchQuery, debouncedSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        debouncedSearch();
      }
    },
    [debouncedSearch]
  );

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

    if (show) {
      root.classList.add('active');
    } else {
      root.classList.remove('active');
    }

    return () => {
      root.classList.remove('active');
    };
  }, [show]);

  useEffect(() => {
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, handleClickOutside]);

  const renderResults = () => {
    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <p className="modal__error">Impossible de récupérer les jeux. Veuillez réessayer.</p>;
    }

    if (!games) return null;

    return games.length === 0 ? (
      <p className="modal__no-results">Aucun jeu ne correspond à la recherche</p>
    ) : (
      games.map((game) => (
        <div key={game._id} className="modal__game-item">
          <p>{game.name}</p>
        </div>
      ))
    );
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal__content" ref={modalRef}>
        <span className="modal__close" onClick={onClose}>
          &times;
        </span>
        <h2 className="modal__title">Rechercher vos jeux</h2>
        <div className="modal__search-input-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Entrez le nom du jeu..."
            className="modal__search-input"
          />
          {searchQuery && (
            <button onClick={handleClearSearch} className="modal__clear-button">
              ❌
            </button>
          )}
          <button onClick={debouncedSearch} className="modal__search-button">
            🔍
          </button>
        </div>
        <div className="modal__results">{renderResults()}</div>
      </div>
    </div>
  );
});

export default Modal;

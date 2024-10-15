import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { normalizeString } from '../utils/normalizeString';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

/**
 * Fonction de requête asynchrone pour récupérer les jeux à partir d'une API en fonction de la recherche.
 *
 * @param {string} searchQuery - La chaîne de recherche utilisée pour trouver les jeux.
 * @returns {Promise<Object[]>} - Retourne une promesse qui se résout en une liste de jeux sous forme d'objet JSON.
 * @throws {Error} - Lance une erreur si la requête échoue.
 */
const fetchGames = async (searchQuery) => {
  const response = await fetch(`http://localhost:3000/games/search?search=${encodeURIComponent(searchQuery)}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des jeux');
  }
  return response.json();
};

/**
 * Composant Modal pour afficher une boîte de dialogue de recherche de jeux vidéo.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {boolean} props.show - Indique si le modal est visible ou non.
 * @param {function} props.onClose - Fonction appelée lorsque le modal est fermé.
 */
const Modal = memo(({ show, onClose }) => {
  const navigate = useNavigate();
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

  /**
   * Fonction de recherche avec délai (debounce) pour limiter le nombre de requêtes API.
   */
  const debouncedSearch = useCallback(
    debounce(() => {
      if (!searchQuery.trim()) return;
      refetch();
    }, 300),
    [searchQuery, refetch]
  );

  // Effet pour déclencher la recherche lorsque la chaîne de recherche change.
  useEffect(() => debouncedSearch(), [searchQuery, debouncedSearch]);

  /**
   * Remet la chaîne de recherche à une chaîne vide.
   */
  const handleClearSearch = useCallback(() => setSearchQuery(''), []);

  /**
   * Gère l'événement 'Enter' pour déclencher la recherche.
   *
   * @param {KeyboardEvent} event - L'événement clavier.
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== 'Enter') return;
      debouncedSearch();
    },
    [debouncedSearch]
  );

  /**
   * Ferme le modal si un clic est effectué en dehors du contenu du modal.
   *
   * @param {MouseEvent} event - L'événement de clic.
   */
  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
        setSearchQuery('');
      }
    },
    [onClose]
  );

  const handleGameClick = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  // Ajoute ou retire une classe CSS au body lorsque le modal est affiché.
  useEffect(() => {
    const root = document.querySelector('#root');
    show ? root.classList.add('active') : root.classList.remove('active');
    return () => {
      root.classList.remove('active');
    };
  }, [show]);

  // Ajoute un écouteur pour fermer le modal en cas de clic à l'extérieur.
  useEffect(() => {
    if (!show) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, handleClickOutside]);

  /**
   * Rend le contenu des résultats de recherche.
   *
   * @returns {JSX.Element|null} Le rendu des résultats ou un message d'erreur/chargement.
   */
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
        <div key={game._id} className="modal__game-item" onClick={() => handleGameClick(game._id)}>
          <p>{game.name}</p>
        </div>
      ))
    );
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal__content" ref={modalRef}>
        <span
          className="modal__close"
          onClick={() => {
            onClose();
            setSearchQuery('');
          }}
        >
          &times;
        </span>
        <h2 className="modal__title">Rechercher vos jeux</h2>
        <div className="modal__search-input-container">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Entrez le nom du jeu..." className="modal__search-input" />
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

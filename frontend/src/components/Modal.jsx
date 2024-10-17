import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { normalizeString } from '../utils/normalizeString';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { fetchGamesBySearch } from '../services/api';

/**
 * Composant Modal pour afficher une boîte de dialogue de recherche de jeux vidéo.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {boolean} props.show - Indique si le modal est visible ou non.
 * @param {function} props.onClose - Fonction appelée lorsque le modal est fermé.
 */
export const ModalSearchGame = memo(({ show, onClose }) => {
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

  // Effet pour déclencher la recherche lorsque la chaîne de recherche change.
  useEffect(() => debouncedSearch(), [searchQuery, debouncedSearch]);

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

/**
 * Composant Modal pour ajouter une note à un jeu.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {boolean} props.show - Indique si le modal est visible ou non.
 * @param {function} props.onClose - Fonction appelée lorsque le modal est fermé.
 * @param {function} props.onSubmit - Fonction appelée lors de la soumission du formulaire pour ajouter une note.
 */
export const ModalAddNote = memo(({ show, onClose, onSubmit }) => {
  const modalRef = useRef(null);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [etat, setEtat] = useState(0);

  /**
   * Ferme le modal si un clic est effectué en dehors du contenu du modal.
   *
   * @param {MouseEvent} event - L'événement de clic.
   */
  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    },
    [onClose]
  );

  // Ajoute un écouteur pour fermer le modal en cas de clic à l'extérieur.
  useEffect(() => {
    if (!show) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, handleClickOutside]);

  /**
   * Gestion de la soumission du formulaire.
   *
   * @param {Event} event - L'événement de soumission du formulaire.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ note, etat, commentaire });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal__content" ref={modalRef}>
        <span
          className="modal__close"
          onClick={() => {
            onClose();
          }}
        >
          &times;
        </span>
        <h2 className="modal__title">Ajouter une note au jeu</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Note (sur 5) :
            <input type="number" value={note} min="0" max="5" onChange={(event) => setNote(event.target.value)} />
          </label>
          <label>
            État :
            <select value={etat} onChange={(event) => setEtat(event.target.value)}>
              <option value={0}>À jouer</option>
              <option value={1}>Joué</option>
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
      </div>
    </div>
  );
});

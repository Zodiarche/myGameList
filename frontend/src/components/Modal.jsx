import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';

import { normalizeString } from '../utils/normalizeString';
import { fetchGamesBySearch, deleteGameUser, createGameData, fetchFilters, deleteGameData, updateGameData } from '../services/api';

import { ModalWrapper } from './ModalWrapper';
import { v4 as uuidv4 } from 'uuid';

export const ModalSearchGame = memo(({ show, onClose, onSelectGame, isForDeletion = false, isForEditing = false }) => {
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
});

export const ModalEditUserGame = memo(({ show, onClose, onSubmit, game }) => {
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
    <ModalWrapper show={show} onClose={onClose} title="Modifier votre avis sur ce jeu">
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
          Mettre à jour
        </button>
      </form>

      <button className="modal__delete" onClick={handleDeleteGame}>
        Supprimer le jeu
      </button>
    </ModalWrapper>
  );
});

/**
 * ModalAddGame component - Fenêtre modale pour ajouter un nouveau jeu.
 *
 * @param {Object} props - Propriétés du composant.
 * @param {boolean} props.show - Indique si la modale doit être affichée.
 * @param {Function} props.onClose - Fonction à appeler pour fermer la modale.
 * @returns {JSX.Element} Composant ModalAddGame.
 */
export const ModalAddGame = memo(({ show, onClose }) => {
  // Définit l'URL de la nouvelle capture d'écran et de l'image de fond
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const [newBackgroundImageUrl, setNewBackgroundImageUrl] = useState('');

  // Définit les données du jeu en état local
  const [gameData, setGameData] = useState({
    idGameBD: uuidv4(),
    name: '',
    description: '',
    platforms: [],
    stores: [],
    released: '',
    background_image: '',
    tags: [],
    esrb_rating: '',
    short_screenshots: [],
  });

  // Récupère les options de filtre via une requête asynchrone
  const {
    data: filterOptions = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ['filters'],
    queryFn: fetchFilters,
    enabled: show,
  });

  /**
   * Met à jour les données du jeu pour une clé donnée.
   * @param {string} key - Clé à mettre à jour.
   * @param {*} value - Nouvelle valeur pour la clé.
   */
  const updateGameData = (key, value) => {
    setGameData((prevData) => ({ ...prevData, [key]: value }));
  };

  /**
   * Gère le changement d'un champ de saisie.
   * @param {Object} event - L'événement de changement de champ.
   */
  const handleInputChange = ({ target: { name, value } }) => {
    if (name === 'background_image') {
      validateAndSetImage(value.trim(), (isValid) => {
        if (isValid) updateGameData(name, value.trim());
        else alert("L'URL fournie pour l'image de fond n'est pas valide. Veuillez vérifier le lien.");
      });
    } else {
      updateGameData(name, value);
    }
  };

  /**
   * Gère la modification d'un champ de sélection (ex : plateformes, magasins).
   * @param {Object} event - L'événement de changement de sélection.
   * @param {string} key - Clé des données à mettre à jour.
   * @param {boolean} [isMultiSelect=true] - Indique s'il s'agit d'une sélection multiple.
   */
  const handleSelectChange = ({ target: { value } }, key, isMultiSelect = true) => {
    updateGameData(key, isMultiSelect ? [...new Set([...gameData[key], value])] : value);
  };

  /**
   * Gère la suppression d'un élément dans une liste.
   * @param {*} item - L'élément à supprimer.
   * @param {string} key - Clé des données à mettre à jour.
   */
  const handleItemRemove = (item, key) => {
    updateGameData(
      key,
      gameData[key].filter((i) => i !== item)
    );
  };

  /**
   * Gère le changement d'un champ d'image.
   * @param {Function} setter - Fonction pour mettre à jour l'état local.
   * @returns {Function} Fonction de gestion du changement d'image.
   */
  const handleImageInputChange =
    (setter) =>
    ({ target: { value } }) =>
      setter(value);

  /**
   * Valide l'URL d'une image.
   * @param {string} url - URL de l'image à valider.
   * @param {Function} callback - Fonction à appeler avec le résultat de la validation.
   */
  const validateAndSetImage = (url, callback) => {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
  };

  /**
   * Gère l'ajout d'une image (background ou screenshot).
   * @param {string} url - URL de l'image à ajouter.
   * @param {string} key - Clé des données à mettre à jour.
   * @param {Function} setter - Fonction pour réinitialiser l'état local.
   */
  const handleImageAdd = async (url, key, setter) => {
    validateAndSetImage(url.trim(), (isValid) => {
      if (isValid) {
        updateGameData(key, key === 'short_screenshots' ? [...new Set([...gameData[key], url.trim()])] : url.trim());
        setter('');
      } else {
        alert("L'URL fournie n'est pas une image valide. Veuillez vérifier le lien.");
      }
    });
  };

  /**
   * Gère la soumission du formulaire.
   * @param {Object} event - L'événement de soumission du formulaire.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createGameData(gameData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du jeu :", error);
    }
  };

  const renderSelectField = (label, key, options, isMultiSelect = true) => (
    <div className="modal__field">
      <label className="modal__label">{label} :</label>
      <div className="modal__multi-input">
        <select className="modal__select" value="" onChange={(e) => handleSelectChange(e, key, isMultiSelect)}>
          <option value="" disabled>
            Choisissez {label}
          </option>
          {options
            ?.filter((option) => (isMultiSelect ? !gameData[key].includes(option) : true))
            ?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      </div>
      {renderSelectedItems(gameData[key], key)}
    </div>
  );

  const renderSelectedItems = (items, key) =>
    items.length > 0 && (
      <>
        <div>&nbsp;</div>
        <div className="modal__results">
          {Array.isArray(items) ? (
            items.map((item, index) => (
              <div key={index} className="modal__game-item" onClick={() => handleItemRemove(item, key)}>
                <p>{item}</p>
              </div>
            ))
          ) : (
            <div className="modal__game-item" onClick={() => handleItemRemove(items, key)}>
              <p>{items}</p>
            </div>
          )}
        </div>
      </>
    );

  if (isLoading) return <p>Chargement des filtres...</p>;
  if (error) return <p>Erreur lors de la récupération des filtres.</p>;

  return (
    <ModalWrapper show={show} onClose={onClose} title="Ajouter un jeu">
      <form className="modal__form" onSubmit={handleSubmit}>
        {renderInputField('Nom du jeu', 'name', gameData.name, handleInputChange)}
        {renderTextAreaField('Description', 'description', gameData.description, handleInputChange)}
        {renderBackgroundImageField(newBackgroundImageUrl, handleImageInputChange(setNewBackgroundImageUrl), () => handleImageAdd(newBackgroundImageUrl, 'background_image', setNewBackgroundImageUrl), gameData.background_image)}
        {['platforms', 'stores', 'tags'].map((key) => renderSelectField(key.charAt(0).toUpperCase() + key.slice(1), key, filterOptions[key], true))}
        {renderSelectField('ESRB Rating', 'esrb_rating', filterOptions.esrbRatings, false)}
        {renderInputField('Date de sortie', 'released', gameData.released, handleInputChange, 'date')}
        {renderScreenshotField(newScreenshotUrl, handleImageInputChange(setNewScreenshotUrl), () => handleImageAdd(newScreenshotUrl, 'short_screenshots', setNewScreenshotUrl), gameData.short_screenshots, handleItemRemove)}
        <button className="modal__submit" type="submit">
          Ajouter le jeu
        </button>
      </form>
    </ModalWrapper>
  );
});

/**
 * ModalEditGameData component - Fenêtre modale pour modifier un jeu existant.
 *
 * @param {Object} props - Propriétés du composant.
 * @param {boolean} props.show - Indique si la modale doit être affichée.
 * @param {Function} props.onClose - Fonction à appeler pour fermer la modale.
 * @param {Object} props.game - Données du jeu à modifier.
 * @param {Function} [props.refetch] - Fonction pour recharger les données des jeux après modification.
 * @returns {JSX.Element} Composant ModalEditGameData.
 */
export const ModalEditGameData = memo(({ show, onClose, game, refetch }) => {
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const queryClient = useQueryClient();

  const [gameData, setGameData] = useState({
    name: '',
    description: '',
    platforms: [],
    stores: [],
    released: '',
    background_image: '',
    tags: [],
    esrb_rating: '',
    short_screenshots: [],
  });

  useEffect(() => {
    if (game) {
      setGameData({
        name: game.name || '',
        description: game.description || '',
        platforms: game.platforms || [],
        stores: game.stores || [],
        tags: game.tags || [],
        esrb_rating: game.esrb_rating || '',
        released: game.released || '',
        short_screenshots: game.short_screenshots || [],
      });
    }
  }, [game]);

  const handleInputChange = ({ target: { name, value } }) => {
    setGameData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = ({ target: { value } }, key, isMultiSelect = true) => {
    setGameData((prevData) => ({
      ...prevData,
      [key]: isMultiSelect ? addUniqueItem(prevData[key], value) : value,
    }));
  };

  const addUniqueItem = (array, item) => [...new Set([...array, item])];

  const handleScreenshotInputChange = ({ target: { value } }) => {
    setNewScreenshotUrl(value);
  };

  const handleScreenshotAdd = async () => {
    if (newScreenshotUrl.trim()) {
      setGameData((prevData) => ({
        ...prevData,
        short_screenshots: addUniqueItem(prevData.short_screenshots, newScreenshotUrl.trim()),
      }));
      setNewScreenshotUrl('');
    } else {
      alert("L'URL fournie n'est pas une image valide. Veuillez vérifier le lien.");
    }
  };

  const handleScreenshotRemove = (screenshot) => {
    setGameData((prevData) => ({
      ...prevData,
      short_screenshots: prevData.short_screenshots.filter((img) => img !== screenshot),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Appel à updateGameData pour mettre à jour les données du jeu
      await updateGameData({ ...gameData, id: game._id });
      alert('Jeu modifié avec succès');
      queryClient.invalidateQueries(['games']);
      onClose();
      if (refetch) refetch();
    } catch (error) {
      console.error('Erreur lors de la modification du jeu :', error);
    }
  };

  const handleDeleteGame = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) return;

    try {
      await deleteGameData(game._id);
      alert('Jeu supprimé avec succès');
      queryClient.invalidateQueries(['games']);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression du jeu:', error);
    }
  };

  if (!show) return null;

  return (
    <ModalWrapper show={show} onClose={onClose} title="Modifier un jeu">
      <form className="modal__form" onSubmit={handleSubmit}>
        {renderInputField('Nom du jeu', 'name', gameData.name, handleInputChange)}
        {renderTextAreaField('Description', 'description', gameData.description, handleInputChange)}
        {renderInputField('Date de sortie', 'released', gameData.released, handleInputChange, 'date')}
        {renderScreenshotField(newScreenshotUrl, handleScreenshotInputChange, handleScreenshotAdd, gameData.short_screenshots, handleScreenshotRemove)}
        <button className="modal__submit" type="submit">
          Mettre à jour
        </button>
        <button className="modal__delete" type="button" onClick={handleDeleteGame}>
          Supprimer le jeu
        </button>
      </form>
    </ModalWrapper>
  );
});

/**
 * Composant de champ de saisie.
 *
 * @param {string} label - Label du champ.
 * @param {string} name - Nom de l'attribut du champ.
 * @param {string} value - Valeur actuelle du champ.
 * @param {Function} onChange - Fonction pour gérer le changement de valeur.
 * @param {string} [type='text'] - Type de champ (par défaut : 'text').
 * @returns {JSX.Element} Composant de champ de saisie.
 */
export const renderInputField = (label, name, value, onChange, type = 'text') => (
  <div className="modal__field">
    <label className="modal__label">{label} :</label>
    <input className="modal__input" type={type} name={name} value={value} onChange={onChange} />
  </div>
);

/**
 * Composant de champ de capture d'écran.
 *
 * @param {string} url - URL de la capture d'écran.
 * @param {Function} onChange - Fonction pour gérer le changement de l'URL.
 * @param {Function} onAdd - Fonction pour ajouter la capture d'écran.
 * @param {Array<string>} screenshots - Liste des captures d'écran existantes.
 * @param {Function} onRemove - Fonction pour supprimer une capture d'écran.
 * @returns {JSX.Element} Composant de champ de capture d'écran.
 */
export const renderScreenshotField = (url, onChange, onAdd, screenshots, onRemove) => (
  <div className="modal__field">
    <label className="modal__label">Captures d'écran :</label>
    <div className="modal__multi-input">
      <input className="modal__input" type="text" placeholder="URL de la capture d'écran" value={url} onChange={onChange} />
      <button type="button" className="modal__add" onClick={onAdd} disabled={!url.trim()}>
        Ajouter
      </button>
    </div>

    {screenshots.length > 0 && (
      <>
        <div>&nbsp;</div>
        <div className="modal__results">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="modal__game-item" onClick={() => onRemove(screenshot)}>
              <img src={screenshot} alt={`Screenshot ${index + 1}`} />
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

/**
 * Composant de champ d'image de fond.
 *
 * @param {string} url - URL de l'image de fond.
 * @param {Function} onChange - Fonction pour gérer le changement de l'URL.
 * @param {Function} onAdd - Fonction pour ajouter l'image de fond.
 * @param {string} backgroundImage - URL de l'image de fond actuelle.
 * @returns {JSX.Element} Composant de champ d'image de fond.
 */
export const renderBackgroundImageField = (url, onChange, onAdd, backgroundImage) => (
  <div className="modal__field">
    <label className="modal__label">Image de fond :</label>
    <div className="modal__multi-input">
      <input className="modal__input" type="text" placeholder="URL de l'image de fond" value={url} onChange={onChange} />
      <button type="button" className="modal__add" onClick={onAdd} disabled={!url.trim()}>
        Ajouter
      </button>
    </div>

    {backgroundImage && (
      <>
        <div>&nbsp;</div>
        <div className="modal__results">
          <div className="modal__game-item">
            <img src={backgroundImage} alt="Background" />
          </div>
        </div>
      </>
    )}
  </div>
);

/**
 * Composant de champ de zone de texte.
 *
 * @param {string} label - Label du champ.
 * @param {string} name - Nom de l'attribut du champ.
 * @param {string} value - Valeur actuelle du champ.
 * @param {Function} onChange - Fonction pour gérer le changement de valeur.
 * @returns {JSX.Element} Composant de champ de zone de texte.
 */
export const renderTextAreaField = (label, name, value, onChange) => (
  <div className="modal__field">
    <label className="modal__label">{label} :</label>
    <textarea className="modal__textarea" name={name} rows="4" value={value} onChange={onChange} />
  </div>
);

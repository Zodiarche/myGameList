import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';

import { normalizeString } from '../utils/normalizeString';
import { fetchGamesBySearch, deleteGameUser, createGameData, fetchFilters, deleteGameData } from '../services/api';

import { ModalWrapper } from './ModalWrapper';
import { v4 as uuidv4 } from 'uuid';

export const ModalEditGameData = memo(({ show, onClose, game, refetch }) => {
  const [gameData, setGameData] = useState({
    name: '',
    description: '',
    platforms: [],
    stores: [],
    tags: [],
    esrb_rating: '',
    released: '',
    short_screenshots: [],
  });

  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(game);

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

export const ModalAddGame = memo(({ show, onClose }) => {
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const [newBackgroundImageUrl, setNewBackgroundImageUrl] = useState('');
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

  const {
    data: filterOptions = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ['filters'],
    queryFn: fetchFilters,
    enabled: show,
  });

  const handleInputChange = ({ target: { name, value } }) => {
    if (name === 'background_image') {
      isValidImageUrl(value.trim()).then((isValid) => {
        if (isValid) {
          updateGameData(name, value.trim());
        } else {
          alert("L'URL fournie pour l'image de fond n'est pas une image valide. Veuillez vérifier le lien.");
        }
      });
    } else {
      updateGameData(name, value);
    }
  };

  const handleSelectChange = ({ target: { value } }, key, isMultiSelect = true) => {
    updateGameData(key, isMultiSelect ? addUniqueItem(gameData[key], value) : value);
  };

  const updateGameData = (key, value) => {
    setGameData((prevData) => ({ ...prevData, [key]: value }));
  };

  const addUniqueItem = (array, item) => [...new Set([...array, item])];

  const handleItemRemove = (item, key) => {
    updateGameData(
      key,
      gameData[key].filter((i) => i !== item)
    );
  };

  const handleScreenshotInputChange = ({ target: { value } }) => {
    setNewScreenshotUrl(value);
  };

  const handleBackgroundImageInputChange = ({ target: { value } }) => {
    setNewBackgroundImageUrl(value);
  };

  const isValidImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleScreenshotAdd = async () => {
    if (await isValidImageUrl(newScreenshotUrl.trim())) {
      updateGameData('short_screenshots', addUniqueItem(gameData.short_screenshots, newScreenshotUrl.trim()));
      setNewScreenshotUrl('');
    } else {
      alert("L'URL fournie n'est pas une image valide. Veuillez vérifier le lien.");
    }
  };

  const handleBackgroundImageAdd = async () => {
    if (await isValidImageUrl(newBackgroundImageUrl.trim())) {
      updateGameData('background_image', newBackgroundImageUrl.trim());
      setNewBackgroundImageUrl('');
    } else {
      alert("L'URL fournie pour l'image de fond n'est pas une image valide. Veuillez vérifier le lien.");
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
      await createGameData(gameData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du jeu :", error);
    }
  };

  if (isLoading) return <p>Chargement des filtres...</p>;
  if (error) return <p>Erreur lors de la récupération des filtres.</p>;

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

  return (
    <ModalWrapper show={show} onClose={onClose} title="Ajouter un jeu">
      <form className="modal__form" onSubmit={handleSubmit}>
        {renderInputField('Nom du jeu', 'name', gameData.name, handleInputChange)}
        {renderTextAreaField('Description', 'description', gameData.description, handleInputChange)}
        {renderBackgroundImageField(newBackgroundImageUrl, handleBackgroundImageInputChange, handleBackgroundImageAdd, gameData.background_image)}
        {renderSelectField('Plateformes', 'platforms', filterOptions.platforms)}
        {renderSelectField('Stores', 'stores', filterOptions.stores)}
        {renderSelectField('Tags', 'tags', filterOptions.tags)}
        {renderSelectField('ESRB Rating', 'esrb_rating', filterOptions.esrbRatings, false)}
        {renderInputField('Date de sortie', 'released', gameData.released, handleInputChange, 'date')}
        {renderScreenshotField(newScreenshotUrl, handleScreenshotInputChange, handleScreenshotAdd, gameData.short_screenshots, handleScreenshotRemove)}
        <button className="modal__submit" type="submit">
          Ajouter le jeu
        </button>
      </form>
    </ModalWrapper>
  );
});

export const renderInputField = (label, name, value, onChange, type = 'text') => (
  <div className="modal__field">
    <label className="modal__label">{label} :</label>
    <input className="modal__input" type={type} name={name} value={value} onChange={onChange} />
  </div>
);

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

export const renderTextAreaField = (label, name, value, onChange) => (
  <div className="modal__field">
    <label className="modal__label">{label} :</label>
    <textarea className="modal__textarea" name={name} rows="4" value={value} onChange={onChange} />
  </div>
);

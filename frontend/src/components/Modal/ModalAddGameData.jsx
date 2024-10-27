import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from '@tanstack/react-query';

import { createGameData, fetchFilters } from '../../services/api';
import ModalWrapper from './ModalWrapper';

const ModalAddGameData = ({ show, onClose }) => {
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
    isError,
  } = useQuery({
    queryKey: ['filters'],
    queryFn: fetchFilters,
    enabled: show,
  });

  const updateGameData = (key, value) => {
    setGameData((prevData) => ({ ...prevData, [key]: value }));
  };

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

  const handleSelectChange = (event, key, isMultiSelect = true) => {
    const { value } = event.target;

    // Mise à jour des données
    updateGameData(key, isMultiSelect ? [...new Set([...gameData[key], value])] : value);

    // Réinitialise la sélection à l'option "Choisissez ..." en remettant l'index sélectionné à 0
    event.target.selectedIndex = 0;
  };

  const handleItemRemove = (item, key) => {
    if (Array.isArray(gameData[key])) {
      updateGameData(
        key,
        gameData[key].filter((i) => i !== item)
      );
    } else {
      updateGameData(key, '');
    }
  };

  const handleImageInputChange =
    (setter) =>
    ({ target: { value } }) =>
      setter(value);

  const validateAndSetImage = (url, callback) => {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createGameData(gameData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du jeu :", error);
    }
  };

  if (isLoading) return <p className="states__highlight">Chargement du formulaire...</p>;
  if (isError) return <p className="states__error">Erreur lors de la récupération du formulaire.</p>;

  return (
    <ModalWrapper show={show} onClose={onClose} title="Ajouter un jeu">
      <form className="modal__form" onSubmit={handleSubmit}>
        <div className="modal__field-container">
          <div className="modal__field">
            <label className="modal__label">Nom du jeu :</label>
            <input className="modal__input" type="text" name="name" value={gameData.name} onChange={handleInputChange} />
          </div>

          <div className="modal__field">
            <label className="modal__label">Date de sortie :</label>
            <input className="modal__input" type="date" name="released" value={gameData.released} onChange={handleInputChange} />
          </div>
        </div>

        <div className="modal__field">
          <label className="modal__label">Description :</label>
          <textarea className="modal__textarea" name="description" rows="4" value={gameData.description} onChange={handleInputChange} />
        </div>

        {['platforms', 'stores', 'tags'].map((key) => (
          <div key={key} className="modal__field">
            <label className="modal__label">{key.charAt(0).toUpperCase() + key.slice(1)} :</label>
            <div className="modal__multi-input">
              <select className="modal__select" onChange={(event) => handleSelectChange(event, key, true)} defaultValue="default">
                <option value="default" disabled>
                  Choisissez {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
                {filterOptions[key]
                  ?.filter((option) => !gameData[key].includes(option))
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>

            {gameData[key].length > 0 && (
              <>
                <div>&nbsp;</div>
                <div className="modal__results">
                  {gameData[key].map((item) => (
                    <div key={item} className="modal__game-item" onClick={() => handleItemRemove(item, key)}>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        <div className="modal__field">
          <label className="modal__label">ESRB Rating :</label>
          <div className="modal__multi-input">
            <select className="modal__select" onChange={(event) => handleSelectChange(event, 'esrb_rating', false)} defaultValue="default">
              <option value="default" disabled>
                Choisissez ESRB Rating
              </option>
              {filterOptions.esrbRatings
                ?.filter((option) => option !== gameData.esrb_rating)
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>

          {gameData.esrb_rating && (
            <>
              <div>&nbsp;</div>
              <div className="modal__results">
                <div className="modal__game-item" onClick={() => handleItemRemove(gameData.esrb_rating, 'esrb_rating')}>
                  <p>{gameData.esrb_rating}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal__field">
          <label className="modal__label">Image de fond :</label>
          <div className="modal__multi-input">
            <input className="modal__input" type="text" placeholder="URL de l'image de fond" value={newBackgroundImageUrl} onChange={handleImageInputChange(setNewBackgroundImageUrl)} />
            <button type="button" className="modal__add" onClick={() => handleImageAdd(newBackgroundImageUrl, 'background_image', setNewBackgroundImageUrl)} disabled={!newBackgroundImageUrl.trim()}>
              Ajouter
            </button>
          </div>

          {gameData.background_image && (
            <>
              <div>&nbsp;</div>
              <div className="modal__results">
                <div className="modal__game-item" onClick={() => handleItemRemove(gameData.background_image, 'background_image')}>
                  <img src={gameData.background_image} alt="Background" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal__field">
          <label className="modal__label">Captures d'écran :</label>
          <div className="modal__multi-input">
            <input className="modal__input" type="text" placeholder="URL de la capture d'écran" value={newScreenshotUrl} onChange={handleImageInputChange(setNewScreenshotUrl)} />
            <button type="button" className="modal__add" onClick={() => handleImageAdd(newScreenshotUrl, 'short_screenshots', setNewScreenshotUrl)} disabled={!newScreenshotUrl.trim()}>
              Ajouter
            </button>
          </div>

          {gameData.short_screenshots.length > 0 && (
            <>
              <div>&nbsp;</div>
              <div className="modal__results">
                {gameData.short_screenshots.map((screenshot, index) => (
                  <div key={index} className="modal__game-item" onClick={() => handleItemRemove(screenshot, 'short_screenshots')}>
                    <img src={screenshot} alt={`Screenshot ${index + 1}`} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button className="modal__submit" type="submit">
          Ajouter le jeu
        </button>
      </form>
    </ModalWrapper>
  );
};

export default ModalAddGameData;

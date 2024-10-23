import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from '@tanstack/react-query';

import { createGameData, fetchFilters } from '../../services/api';

import ModalWrapper from './ModalWrapper';
import renderBackgroundImageField from '../render/renderBackgroundImageField';
import renderTextAreaField from '../render/renderTextAreaField';
import renderScreenshotField from '../render/renderTextAreaField';

/**
 * ModalAddGame component - Fenêtre modale pour ajouter un nouveau jeu.
 *
 * @param {Object} props - Propriétés du composant.
 * @param {boolean} props.show - Indique si la modale doit être affichée.
 * @param {Function} props.onClose - Fonction à appeler pour fermer la modale.
 * @returns {JSX.Element}
 */
const ModalAddGame = ({ show, onClose }) => {
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
};

export default ModalAddGame;

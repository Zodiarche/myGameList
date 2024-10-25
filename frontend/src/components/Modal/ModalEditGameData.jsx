import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import ModalWrapper from './ModalWrapper';

import renderInputField from '../render/renderInputField';
import renderScreenshotField from '../render/renderTextAreaField';

import { deleteGameData, updateGameData } from '../../services/api';

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
const ModalEditGameData = ({ show, onClose, game, refetch }) => {
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
};

export default ModalEditGameData;

import React, { useState } from 'react';

import { ModalAddGameData, ModalSearchGame, ModalEditGameData } from '../components';

import { deleteGameData } from '../services/api';

const Dashboard = () => {
  const [isSearchGameModalOpen, setSearchGameModalOpen] = useState(false);
  const [isAddGameModalOpen, setAddGameModalOpen] = useState(false);
  const [isEditGameModalOpen, setEditGameModalOpen] = useState(false);
  const [isDeletionMode, setDeletionMode] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleDeleteGame = async (gameId, refetchGames) => {
    try {
      if (!gameId) return;

      const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?');
      if (!confirmed) return;

      await deleteGameData(gameId);
      alert('Le jeu a été supprimé avec succès');

      if (refetchGames) refetchGames();
    } catch (error) {
      console.error('Erreur lors de la suppression du jeu :', error);
    }
  };

  const handleSelectGameForDeletion = (gameId, refetchGames) => {
    handleDeleteGame(gameId, refetchGames);
  };

  const handleSelectGameForEditing = (game) => {
    setSelectedGame(game);
    setEditGameModalOpen(true);
    setSearchGameModalOpen(false);
  };

  const openSearchModalForEditing = () => {
    setDeletionMode(false);
    setSearchGameModalOpen(true);
  };

  const openSearchModalForDeletion = () => {
    setDeletionMode(true);
    setSearchGameModalOpen(true);
  };

  return (
    <main id="dashboard">
      <section id="dashboard" className="dashboard">
        <div className="dashboard__wrapper">
          <h1 className="dashboard__title">Tableau de Bord</h1>

          <div className="dashboard__buttons">
            <button className="dashboard__button" onClick={() => setAddGameModalOpen(true)}>
              Ajouter un jeu
            </button>
            <button className="dashboard__button" onClick={openSearchModalForEditing}>
              Modifier un jeu
            </button>
            <button className="dashboard__button" onClick={openSearchModalForDeletion}>
              Supprimer un jeu
            </button>
          </div>

          <ModalAddGameData show={isAddGameModalOpen} onClose={() => setAddGameModalOpen(false)} />
          <ModalSearchGame
            show={isSearchGameModalOpen}
            onClose={() => setSearchGameModalOpen(false)}
            isForDeletion={isDeletionMode}
            isForEditing={!isDeletionMode}
            onSelectGame={isDeletionMode ? handleSelectGameForDeletion : handleSelectGameForEditing}
          />
          {selectedGame && <ModalEditGameData show={isEditGameModalOpen} onClose={() => setEditGameModalOpen(false)} game={selectedGame} refetch={() => setSearchGameModalOpen(true)} />}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;

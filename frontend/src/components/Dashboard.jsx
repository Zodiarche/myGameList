import React, { useState } from 'react';
import { ModalAddGame, ModalSearchGameToDelete } from './Modal';
import { deleteGameData } from '../services/api';

const Dashboard = () => {
  const [isSearchGameModalOpen, setSearchGameModalOpen] = useState(false);
  const [isAddGameModalOpen, setAddGameModalOpen] = useState(false);

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

  return (
    <main id="dashboard">
      <section className="dashboard">
        <div className="dashboard__wrapper">
          <h1 className="dashboard__title">Tableau de Bord</h1>

          <div className="dashboard__buttons">
            <button onClick={() => setAddGameModalOpen(true)}>Ajouter un jeu</button>
            <button>Modifier un jeu</button>
            <button onClick={() => setSearchGameModalOpen(true)}>Supprimer un jeu</button>
          </div>

          <ModalAddGame show={isAddGameModalOpen} onClose={() => setAddGameModalOpen(false)} />
          <ModalSearchGameToDelete show={isSearchGameModalOpen} onClose={() => setSearchGameModalOpen(false)} onSelectGame={(gameId, refetchGames) => handleSelectGameForDeletion(gameId, refetchGames)} />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;

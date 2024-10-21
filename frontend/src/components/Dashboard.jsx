import React, { useState } from 'react';
import { ModalAddGame } from './Modal';

const Dashboard = () => {
  const [isAddGameModalOpen, setAddGameModalOpen] = useState(false);

  return (
    <main id="dashboard">
      <section className="dashboard">
        <div className="dashboard__wrapper">
          <h1 className="dashboard__title">Tableau de Bord</h1>

          <div className="dashboard__buttons">
            <button onClick={() => setAddGameModalOpen(true)}>Ajouter un jeu</button>
            <button>Modifier un jeu</button>
            <button>Supprimer un jeu</button>
          </div>

          <ModalAddGame show={isAddGameModalOpen} onClose={() => setAddGameModalOpen(false)} />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;

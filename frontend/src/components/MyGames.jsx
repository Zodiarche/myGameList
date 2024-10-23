import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ModalEditUserGame } from './index';
import { fetchGameUsers, updateGameUser } from '../services/api';

const MyGames = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const { data: gamesInLibrary, isLoading } = useQuery({
    queryKey: ['gameUsers'],
    queryFn: fetchGameUsers,
  });

  const updateGameMutation = useMutation({
    mutationFn: updateGameUser,
    onSuccess: () => {
      queryClient.invalidateQueries('gameUsers');
    },
  });

  const handleEditGame = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleSubmitEditGame = (updatedGameData) => {
    updateGameMutation.mutate({
      id: selectedGame._id,
      ...updatedGameData,
    });
  };

  const getGameStatus = (etat) => {
    switch (etat) {
      case 0:
        return 'À jouer';
      case 1:
        return 'En cours';
      case 2:
        return 'Abandonné';
      case 3:
        return 'Terminé';
      default:
        return 'Inconnu';
    }
  };

  if (isLoading) return <p>Chargement des jeux...</p>;

  return (
    <main id="my-games">
      <section id="my-games" className="my-games">
        <h1 className="my-games__title">Ma Bibliothèque</h1>

        <ul className="my-games__list">
          {gamesInLibrary &&
            gamesInLibrary.map((game) => (
              <li className="my-games__item" key={game._id} onClick={() => handleEditGame(game)}>
                <h3 className="my-games__subtitle">{game.idGameBD.name}</h3>

                <p className="my-games__status">État : {getGameStatus(game.etat)}</p>
                <p className="my-games__rating">Note : {game.note}</p>
                <p className="my-games__comment">Commentaire : {game.commentaire || 'Pas de commentaire'}</p>
              </li>
            ))}
        </ul>

        {selectedGame && <ModalEditUserGame show={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitEditGame} game={selectedGame} />}
      </section>
    </main>
  );
};

export default MyGames;

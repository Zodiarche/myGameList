import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ModalEditUserGame } from './index';
import { fetchGameUsers, updateGameUser } from '../services/api';

const MyGames = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null);
  const [selectedCommentFilter, setSelectedCommentFilter] = useState(null);

  const {
    data: gamesInLibrary,
    isLoading,
    isError,
  } = useQuery({
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

  // Filtrer les jeux en fonction des filtres sélectionnés
  const filteredGames = gamesInLibrary?.filter((game) => {
    const matchesRating = selectedRatingFilter === null || game.note === selectedRatingFilter;
    const matchesStatus = selectedStatusFilter === null || game.etat === selectedStatusFilter;
    const matchesComment = selectedCommentFilter === null || (selectedCommentFilter === 'with' && game.commentaire) || (selectedCommentFilter === 'without' && !game.commentaire);

    return matchesRating && matchesStatus && matchesComment;
  });

  return (
    <main id="my-games">
      <section id="my-games" className="my-games">
        <h1 className="my-games__title">Ma Bibliothèque</h1>

        <div className="my-games__field-container">
          {/* Filtre par note */}
          <div className="my-games__field">
            <label htmlFor="ratingFilter">Filtrer par note :</label>
            <select id="ratingFilter" value={selectedRatingFilter ?? ''} onChange={(e) => setSelectedRatingFilter(e.target.value === '' ? null : parseInt(e.target.value, 10))}>
              <option value="">Toutes</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          {/* Filtre par état */}
          <div className="my-games__field">
            <label htmlFor="statusFilter">Filtrer par état :</label>
            <select id="statusFilter" value={selectedStatusFilter ?? ''} onChange={(e) => setSelectedStatusFilter(e.target.value === '' ? null : parseInt(e.target.value, 10))}>
              <option value="">Tous</option>
              <option value="0">À jouer</option>
              <option value="1">En cours</option>
              <option value="2">Abandonné</option>
              <option value="3">Terminé</option>
            </select>
          </div>

          {/* Filtre par présence de commentaire */}
          <div className="my-games__field">
            <label htmlFor="commentFilter">Filtrer par commentaire :</label>
            <select id="commentFilter" value={selectedCommentFilter ?? ''} onChange={(e) => setSelectedCommentFilter(e.target.value === '' ? null : e.target.value)}>
              <option value="">Tous</option>
              <option value="with">Avec commentaire</option>
              <option value="without">Sans commentaire</option>
            </select>
          </div>
        </div>

        {isLoading && <p className="states__highlight">Le chargement des jeux est en cours.</p>}
        {isError && <p className="states__error">Une erreur est survenue durant la récupération des jeux.</p>}
        {!isLoading &&
          !isError &&
          (filteredGames && filteredGames.length > 0 ? (
            <ul className="my-games__list">
              {filteredGames.map((game) => (
                <li className="my-games__item" key={game._id} onClick={() => handleEditGame(game)}>
                  <h3 className="my-games__subtitle">{game.idGameBD.name}</h3>
                  <p className="my-games__status">État : {getGameStatus(game.etat)}</p>
                  <p className="my-games__rating">Note : {game.note}</p>
                  <p className="my-games__comment">Commentaire : {game.commentaire || 'Pas de commentaire'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="states__highlight">Aucun jeu ne correspond aux critères de filtrage sélectionnés.</p>
          ))}

        {selectedGame && <ModalEditUserGame show={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitEditGame} game={selectedGame} />}
      </section>
    </main>
  );
};

export default MyGames;

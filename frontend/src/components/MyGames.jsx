// src/components/MyGames.js
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchGameUsers, updateGameUser, createGameUser, fetchGames } from '../services/api';

const MyGames = () => {
  const queryClient = useQueryClient();
  const [newGameId, setNewGameId] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newHeure, setNewHeure] = useState('');
  const [newEtat, setNewEtat] = useState('');

  const { data: gamesInLibrary, isLoading } = useQuery({
    queryKey: ['gameUsers'],
    queryFn: fetchGameUsers,
  });

  const { data: allGames } = useQuery({
    queryKey: ['games'],
    queryFn: fetchGames,
  });

  const addGameMutation = useMutation({
    mutationFn: createGameUser,
    onSuccess: () => {
      queryClient.invalidateQueries('gameUsers');
    },
  });

  const updateGameMutation = useMutation({
    mutationFn: updateGameUser,
    onSuccess: () => {
      queryClient.invalidateQueries('gameUsers');
    },
  });

  const handleAddGame = () => {
    addGameMutation.mutate({
      idGameBD: newGameId,
      heure: parseInt(newHeure, 10),
      etat: parseInt(newEtat, 10),
      note: parseInt(newNote, 10),
    });
    setNewGameId('');
    setNewNote('');
    setNewHeure('');
    setNewEtat('');
  };

  const handleUpdateGame = (gameId, updatedState) => {
    updateGameMutation.mutate({
      id: gameId,
      etat: updatedState,
    });
  };

  if (isLoading) return <p>Chargement des jeux...</p>;

  return (
    <div>
      <h2>Ma Bibliothèque de Jeux</h2>
      {/* Liste des jeux */}
      <h3>Ajouter un Nouveau Jeu</h3>
      {/* Formulaire pour ajouter un jeu */}
    </div>
  );
};

export default MyGames;

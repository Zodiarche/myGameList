import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { ModalSearchUser, ModalWrapper } from './index';
import { fetchProfile, followUser, fetchUserById, fetchUserLibrary } from '../services/api';

const Followed = () => {
  const [showModal, setShowModal] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [selectedUserLibrary, setSelectedUserLibrary] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');

  const { data: user } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
  });

  const fetchFollowedUsersInfo = async () => {
    try {
      const followedUsersData = await Promise.all(user.following.map((userId) => fetchUserById(userId)));
      setFollowedUsers(followedUsersData);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs suivis:', error);
    }
  };

  useEffect(() => {
    if (!user && user?.following.length <= 0) return;

    fetchFollowedUsersInfo();
  }, [user]);

  const handleUserSelect = async (selectedUser) => {
    if (!followedUsers.some((otherUser) => otherUser._id === selectedUser._id)) {
      try {
        await followUser(selectedUser._id);
        setFollowedUsers((prev) => [...prev, selectedUser]);
      } catch (error) {
        console.error("Erreur lors du suivi de l'utilisateur:", error);
      }
    }

    setShowModal(false);
  };

  const handleShowLibrary = async (user) => {
    try {
      const library = await fetchUserLibrary(user.id);
      setSelectedUserLibrary(library);
      setSelectedUsername(user.username);
      setShowLibraryModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de la bibliothèque de l'utilisateur:", error);
    }
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

  return (
    <main id="followed">
      <section id="followed" className="followed">
        <h2 className="followed__title">Utilisateurs Suivis</h2>

        <button onClick={() => setShowModal(true)} className="followed__search">
          Rechercher et Suivre un Utilisateur
        </button>

        {followedUsers.length <= 0 && <p className="states__highlight">Aucun utilisateur suivi.</p>}

        {followedUsers.length > 0 && (
          <ul className="followed__list">
            {followedUsers.map((user) => (
              <li key={user.id} className="followed__item" onClick={() => handleShowLibrary(user)}>
                <p className="followed__name">{user.username}</p>
                <span>Voir la bibliothèque</span>
              </li>
            ))}
          </ul>
        )}

        <ModalSearchUser show={showModal} onClose={() => setShowModal(false)} onSelectUser={handleUserSelect} />

        <ModalWrapper show={showLibraryModal} onClose={() => setShowLibraryModal(false)} title={`Bibliothèque de ${selectedUsername}`}>
          <ul className="followed__list followed__list--game">
            {selectedUserLibrary.length > 0 ? (
              selectedUserLibrary.map((game) => {
                return (
                  <li key={game._id} className="followed__item followed__item--game">
                    <h3 className="followed__game-subtitle">{game.idGameBD.name}</h3>
                    <p className="followed__game-status">État : {getGameStatus(game.etat)}</p>
                    <p className="followed__game-rating">Note : {game.note}</p>
                    <p className="followed__game-comment">Commentaire : {game.commentaire || 'Pas de commentaire'}</p>
                  </li>
                );
              })
            ) : (
              <p className="states__highlight">Aucun jeu dans la bibliothèque.</p>
            )}
          </ul>
        </ModalWrapper>
      </section>
    </main>
  );
};

export default Followed;

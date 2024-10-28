import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

import ModalWrapper from './ModalWrapper';
import { fetchProfile, fetchUsersByUsername } from '../../services/api';

const ModalSearchUser = ({ show, onClose, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: user } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
  });

  const {
    data: users,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: () => fetchUsersByUsername(searchQuery),
    enabled: false,
  });

  const debouncedSearch = useCallback(
    debounce(() => {
      if (!searchQuery.trim()) return;
      refetch();
    }, 300),
    [searchQuery, refetch]
  );

  useEffect(() => debouncedSearch(), [searchQuery, debouncedSearch]);

  const handleClearSearch = useCallback(() => setSearchQuery(''), []);
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') debouncedSearch();
    },
    [debouncedSearch]
  );

  const renderStates = () => {
    if (isLoading) return <p className="states__highlight">Recherche en cours...</p>;
    if (error) return <p className="states__error">Erreur lors de la recherche.</p>;
    if (!users || users.length === 0) return <p className="states__info">Aucun utilisateur trouvé.</p>;

    return null;
  };

  const handleUserClick = (user) => {
    handleClearSearch();
    onSelectUser(user);
    onClose();
  };

  const renderUsers = () => {
    if (!users || users.length === 0) return null;

    // Filtrer les utilisateurs déjà suivis
    const filteredUsers = users.filter(
      (otherUser) =>
        otherUser._id !== user._id && // Nous exclure
        !user.following.some((followingUserID) => followingUserID.toString() === otherUser._id) // Exclure ceux déjà suivis
    );

    // Retourner les utilisateurs filtrés
    return filteredUsers.map((user) => (
      <div key={user._id} className="modal__user-item" onClick={() => handleUserClick(user)}>
        <p>{user.username}</p>
      </div>
    ));
  };

  return (
    <ModalWrapper show={show} onClose={onClose} title="Rechercher des utilisateurs">
      <div className="modal__search-input-container">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Entrez le nom de l'utilisateur..." />
        {searchQuery && (
          <button onClick={handleClearSearch} className="modal__clear-button">
            ❌
          </button>
        )}
      </div>

      {renderStates()}

      <div className="modal__results">{renderUsers()}</div>
    </ModalWrapper>
  );
};

export default ModalSearchUser;

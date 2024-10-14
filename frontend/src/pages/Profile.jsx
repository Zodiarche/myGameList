import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProfile } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
    onError: (error) => {
      if (error.message === 'Non autorisé') {
        navigate('/login');
      } else {
        console.error("Erreur lors de la vérification d'authentification", error);
      }
    },
  });

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error.message}</p>;
  }

  return (
    <div>
      <h1>Profil de {user.username}</h1>
      <p>Email : {user.email}</p>
    </div>
  );
};

export default Profile;

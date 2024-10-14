import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/profile', {
          method: 'GET',
          credentials: 'include',
        });

        console.log(response);

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
          } else {
            throw new Error('Erreur de serveur');
          }
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification", error);
        setError("Erreur lors de la vérification d'authentification");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!user) {
    return <p>Redirection vers la page de connexion...</p>;
  }

  return (
    <div>
      <h1>Profil de {user.username}</h1>
      <p>Email : {user.email}</p>
    </div>
  );
};

export default Profile;

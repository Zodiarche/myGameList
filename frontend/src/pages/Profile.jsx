import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { fetchProfile, updateUser, deleteUser, logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const usernameRef = useRef('');
  const emailRef = useRef('');
  const oldPasswordRef = useRef('');
  const newPasswordRef = useRef('');
  const confirmPasswordRef = useRef('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
    retry: false,
    onSuccess: (user) => {
      usernameRef.current.value = user.username;
      emailRef.current.value = user.email;
    },
  });

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile']);
      setSuccessMessage('Modification effectuée avec succès !');
      setErrorMessage('');
    },
    onError: (error) => {
      if (error.response && error.response.status === 400 && error.response.data.message === 'Ancien mot de passe incorrect.') {
        setErrorMessage('Ancien mot de passe incorrect.');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      navigate('/login');
    },
  });

  const handleUsernameSubmit = (event) => {
    event.preventDefault();
    const username = usernameRef.current.value;
    if (!username.trim()) {
      setErrorMessage("Le nom d'utilisateur ne peut pas être vide.");
      setSuccessMessage('');
    } else {
      mutation.mutate({ id: user._id, username });
      setErrorMessage('');
    }
  };

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    if (!email.trim()) {
      setErrorMessage("L'email ne peut pas être vide.");
      setSuccessMessage('');
    } else if (!validateEmail(email)) {
      setErrorMessage('Veuillez entrer une adresse email valide.');
      setSuccessMessage('');
    } else {
      mutation.mutate({ id: user._id, email });
      setErrorMessage('');
    }
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Tous les champs de mot de passe doivent être remplis.');
      setSuccessMessage('');
    } else if (newPassword !== confirmPassword) {
      setErrorMessage('Les nouveaux mots de passe ne correspondent pas.');
      setSuccessMessage('');
    } else {
      mutation.mutate({ id: user._id, oldPassword, newPassword });
      setErrorMessage('');
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) return;
    deleteMutation.mutate(user._id);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error.message}</p>;

  const ProfileSettings = () => (
    <div className="profile__profile-settings">
      <h1 className="profile__title">Profil de {user.username}</h1>
      {successMessage && <p className="profile__success">{successMessage}</p>}
      {errorMessage && <p className="profile__error">{errorMessage}</p>}

      <div className="profile__field-container">
        <div className="profile__field">
          <form className="profile__form" onSubmit={handleUsernameSubmit}>
            <label className="profile__label">Nom d'utilisateur</label>
            <input className="profile__input" ref={usernameRef} type="text" name="username" />
            <button className="profile__submit" type="submit">
              Mettre à jour le nom d'utilisateur
            </button>
          </form>
        </div>

        <div className="profile__field">
          <form className="profile__form" onSubmit={handleEmailSubmit}>
            <label className="profile__label">Email</label>
            <input className="profile__input" ref={emailRef} type="text" name="email" />
            <button className="profile__submit" type="submit">
              Mettre à jour l'email
            </button>
          </form>
        </div>
      </div>

      <form className="profile__form" onSubmit={handlePasswordSubmit}>
        <div className="profile__field-container">
          <div className="profile__field">
            <label className="profile__label">Ancien mot de passe</label>
            <input className="profile__input" ref={oldPasswordRef} type="password" name="oldPassword" />
          </div>

          <div className="profile__field">
            <label className="profile__label">Nouveau mot de passe</label>
            <input className="profile__input" ref={newPasswordRef} type="password" name="newPassword" />
          </div>

          <div className="profile__field">
            <label className="profile__label">Confirmer le nouveau mot de passe</label>
            <input className="profile__input" ref={confirmPasswordRef} type="password" name="confirmPassword" />
          </div>
        </div>

        <button className="profile__submit" type="submit">
          Mettre à jour le mot de passe
        </button>
      </form>

      <button className="profile__delete" type="submit" onClick={handleDelete}>
        Supprimer mon compte
      </button>
    </div>
  );

  const MyGames = () => (
    <div className="profile__games">
      <p></p>
    </div>
  );

  return (
    <main id="profile">
      <section id="profile" className="profile">
        <div className="profile__wrapper">
          <div className="profile__cols">
            <div className="profile__col profile__col--left">
              <nav className="profile__navigation">
                <ul className="profile__list">
                  <li className="profile__item">
                    <a
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setActiveTab('profile');
                      }}
                    >
                      Paramètres utilisateur
                    </a>
                  </li>
                  <li className="profile__item">
                    <a
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setActiveTab('games');
                      }}
                    >
                      Mes jeux
                    </a>
                  </li>
                  <li className="profile__item">
                    <a
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        handleLogout();
                      }}
                    >
                      Déconnexion
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="profile__col profile__col--right">
              {activeTab === 'profile' && <ProfileSettings />}
              {activeTab === 'games' && <MyGames />}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;

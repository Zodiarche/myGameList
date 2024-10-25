import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { fetchProfile, updateUser, deleteUser } from '../services/api';

const ProfileSettings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const usernameRef = useRef('');
  const emailRef = useRef('');
  const oldPasswordRef = useRef('');
  const newPasswordRef = useRef('');
  const confirmPasswordRef = useRef('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
    retry: false,
    onSuccess: (user) => {
      usernameRef.current.value = user.username;
      emailRef.current.value = user.email;
    },
  });

  useEffect(() => {
    if (user) return;

    queryClient.removeQueries(['userProfile']);
    queryClient.setQueryData(['userProfile'], null);
    navigate('/login');
  }, [user]);

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

  return (
    <div className="profile__profile-settings">
      {isLoading && <p className="states__highlight">Le chargement de votre profil est en cours.</p>}
      {isError && <p className="states__error">Une erreur est survenue durant la récupération de votre profil.</p>}

      {!isLoading && !isError && (
        <>
          <h1 className="profile__title">Profil de {user?.username}</h1>

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
        </>
      )}
    </div>
  );
};

export default ProfileSettings;

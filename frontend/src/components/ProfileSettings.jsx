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
      setSuccessMessage('');
      setErrorMessage(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const updates = {
      id: user._id,
      username: usernameRef.current.value,
      email: emailRef.current.value,
      oldPassword: oldPasswordRef.current.value,
      newPassword: newPasswordRef.current.value,
      confirmPassword: confirmPasswordRef.current.value,
    };

    console.log(updates);
    mutation.mutate(updates);
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

          <form className="profile__form" onSubmit={handleSubmit}>
            <div className="profile__field-container">
              <div className="profile__field">
                <label className="profile__label">Nom d'utilisateur</label>
                <input className="profile__input" ref={usernameRef} type="text" name="username" />
              </div>

              <div className="profile__field">
                <label className="profile__label">Email</label>
                <input className="profile__input" ref={emailRef} type="email" name="email" />
              </div>
            </div>

            <p>&nbsp;</p>

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
              Mettre à jour le profil
            </button>
          </form>

          <button className="profile__delete" onClick={handleDelete}>
            Supprimer mon compte
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileSettings;

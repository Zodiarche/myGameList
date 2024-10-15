import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, loginUser } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Vérification si l'utilisateur est déjà connecté au chargement du composant
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
    retry: false,
    onSuccess: (data) => navigate('/profile'),
    onError: () => console.error("Erreur lors de la vérification de l'authentification"),
  });

  // Mutation pour gérer la connexion
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries('userProfile');
      navigate('/profile');
    },
    onError: (error) => setError(error.message || 'Une erreur est survenue. Veuillez réessayer.'),
  });

  const handleLogin = (event) => {
    event.preventDefault();
    setError('');

    loginMutation.mutate({ email, password });
  };

  return (
    <main id="login">
      <section id="login" className="login">
        <div className="login__wrapper">
          <h1 className="login__title">Connexion</h1>

          {error && <p className="login__error">{error}</p>}

          <form className="login__form" onSubmit={handleLogin}>
            <div className="login__field-container">
              <div className="login__field">
                <label className="login__label">Email :</label>
                <input className="login__input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>

              <div className="login__field">
                <label className="login__label">Mot de passe :</label>
                <input className="login__input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
            </div>

            <button className="login__submit" type="submit" disabled={loginMutation.isLoading}>
              {loginMutation.isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="login__signup">
            Vous n'avez pas de compte ? <a href="/signup">Créez-en un ici</a>.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;

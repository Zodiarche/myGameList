import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, signupUser } from '../services/api';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Vérification si l'utilisateur est déjà connecté au chargement du composant
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
    retry: false,
  });

  useEffect(() => {
    if (!userProfile && !userProfile?._id) return;
    navigate('/profile');
  }, [userProfile, navigate]);

  // Mutation pour gérer l'inscription
  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      queryClient.invalidateQueries('userProfile');
      navigate('/login');
    },
    onError: (error) => setError(error.message || 'Une erreur est survenue. Veuillez réessayer.'),
  });

  const handleSignup = (event) => {
    event.preventDefault();
    setError('');

    signupMutation.mutate({ username, email, password, isAdmin });
  };

  return (
    <main id="signup">
      <section id="signup" className="signup">
        <div className="signup__wrapper">
          <h1 className="signup__title">Inscription</h1>

          {error && <p className="signup__error">{error}</p>}

          <form className="signup__form" onSubmit={handleSignup}>
            <div className="signup__field-container">
              <div className="signup__field">
                <label className="signup__label">Nom d'utilisateur :</label>
                <input className="signup__input" type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
              </div>

              <div className="signup__field">
                <label className="signup__label">Email :</label>
                <input className="signup__input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>

              <div className="signup__field">
                <label className="signup__label">Mot de passe :</label>
                <input className="signup__input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
            </div>

            <div className="signup__field">
              <label className="signup__label signup__label--admin">
                <input type="checkbox" checked={isAdmin} onChange={(event) => setIsAdmin(event.target.checked)} />
                Administrateur
              </label>
            </div>

            <button className="signup__submit" type="submit" disabled={signupMutation.isLoading}>
              {signupMutation.isLoading ? 'Inscription en cours...' : "S'inscrire"}
            </button>
          </form>

          <p className="signup__login">
            Vous avez déjà un compte ? <a href="/login">Connectez-vous ici</a>.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signup;

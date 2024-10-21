import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

import ProfileSettings from '../components/ProfileSettings';
import MyGames from '../components/MyGames';
import Dashboard from '../components/Dashboard';

const Profile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');

  const { data: user } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchProfile,
    retry: false,
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      queryClient.removeQueries(['userProfile']);
      queryClient.setQueryData(['userProfile'], null);
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

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

                  {user?.isAdmin && (
                    <li className="profile__item">
                      <a
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          setActiveTab('dashboard');
                        }}
                      >
                        Dashboard
                      </a>
                    </li>
                  )}

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
              {activeTab === 'dashboard' && <Dashboard />}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;

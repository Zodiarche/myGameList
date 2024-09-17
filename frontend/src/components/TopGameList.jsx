import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopGames } from '../services/api';
import SwiperNavigationButton from './swiperNavigationButton.jsx';

import '../modules/swiper/swiper-bundle.min.js';
import '../services/swiper/main.js';
import { initializeSwiperJS } from '../services/swiper/main.js';

const TopGameList = () => {
  const filters = {
    limit: 30,
    sortBy: 'rating',
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['topGames', filters],
    queryFn: () => fetchTopGames(filters),
  });

  useEffect(() => {
    if (!data || data.length <= 0) return;

    const swiperElement = document.getElementById('swiperTopGames');
    if (!swiperElement) return;

    initializeSwiperJS();
  }, [data]);

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur : {error.message}</div>;
  if (!data || data.length <= 0) return <div>Aucun jeu trouvé.</div>;

  return (
    <section id="top-games" className="top-games">
      <div className="top-games__wrapper">
        <h2 className="top-games__title">Les jeux les mieux notés</h2>
        <div className="swiper" id="swiperTopGames">
          <div className="swiper-wrapper">
            {data.map((game) => (
              <div
                className="swiper-slide game-card"
                style={{ backgroundImage: `url(${game.background_image})` }}
                key={game._id}
              >
                <div className="game-card__content">
                  <p className="game-card__name">{game.name}</p>
                  <ul className="game-card__list">
                    <li className="game-card__item">
                      Année de sortie: {new Date(game.released).getFullYear()}
                    </li>
                    <li className="game-card__item">Note: {game.rating} / 5</li>
                    <li className="game-card__item">Nombre de votes: {game.ratings_count}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="swiper-button-next">
            <SwiperNavigationButton />
          </div>

          <div className="swiper-button-prev">
            <SwiperNavigationButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopGameList;

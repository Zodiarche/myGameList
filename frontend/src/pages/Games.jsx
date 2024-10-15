import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGames, fetchFilters } from '../services/api';
import usePagination from '../hooks/usePagination';
import GameFilters from '../components/GameFilters';
import Loading from '../components/Loading';

const Games = () => {
  const [filters, setFilters] = useState({
    platform: '',
    tag: '',
    store: '',
    esrbRating: '',
    releaseYear: '',
    userRating: '',
    metacriticRating: '',
    playtime: '',
  });

  const [availableFilters, setAvailableFilters] = useState({});
  const gamesPerPage = 12;

  // Fetch des jeux via React Query
  const {
    data: games = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['games', filters],
    queryFn: fetchGames,
    keepPreviousData: true,
  });

  // Fetch des filtres disponibles
  useEffect(() => {
    fetchFilters().then((filtersData) => {
      setAvailableFilters(filtersData);
      console.log('Filtres disponibles:', filtersData);
    });
  }, []);

  // Gestion des filtres
  const filteredGames = useMemo(() => {
    let filtered = [...games];
    if (filters.platform) {
      filtered = filtered.filter((game) => game.platforms.some((platform) => platform.name === filters.platform));
    }
    if (filters.tag) {
      filtered = filtered.filter((game) => game.tags.some((tag) => tag.name === filters.tag));
    }
    if (filters.store) {
      filtered = filtered.filter((game) => game.stores.some((store) => store.name === filters.store));
    }
    if (filters.esrbRating) {
      filtered = filtered.filter((game) => game.esrb_rating?.name === filters.esrbRating);
    }
    if (filters.releaseYear) {
      filtered = filtered.filter((game) => new Date(game.released).getFullYear() === parseInt(filters.releaseYear, 10));
    }
    if (filters.userRating) {
      filtered = filtered.filter((game) => game.rating === parseFloat(filters.userRating));
    }
    if (filters.metacriticRating) {
      filtered = filtered.filter((game) => game.metacritic === parseInt(filters.metacriticRating, 10));
    }
    if (filters.playtime) {
      filtered = filtered.filter((game) => game.playtime >= parseInt(filters.playtime, 10));
    }
    return filtered;
  }, [games, filters]);

  // Utilisation du hook de pagination
  const { currentItems: currentGames, renderPageButtons } = usePagination(filteredGames, gamesPerPage);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Erreur: {error.message}</div>;

  return (
    <>
      <main id="games">
        <section id="all-games" className="all-games">
          <div className="all-games__wrapper">
            <h1 className="all-games__title">Liste des Jeux</h1>

            <div className="all-games__cols">
              <div className="all-games__col all-games__col--left">
                <GameFilters filters={filters} availableFilters={availableFilters} handleFilterChange={handleFilterChange} />
              </div>

              <div className="all-games__col all-games__col--right">
                <div className="game-card__container">
                  {currentGames.map((game) => (
                    <div className="game-card" style={{ backgroundImage: `url(${game.background_image})` }} key={game._id}>
                      <div className="game-card__content">
                        <p className="game-card__name">{game.name}</p>
                        <ul className="game-card__list">
                          <li className="game-card__item">Année de sortie: {new Date(game.released).getFullYear()}</li>
                          <li className="game-card__item">Note: {game.rating} / 5</li>
                          <li className="game-card__item">Nombre de votes: {game.ratings_count}</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div>{renderPageButtons()}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Games;

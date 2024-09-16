import { useQuery } from '@tanstack/react-query';
import { fetchTopGames } from '../services/api';

const TopGameList = () => {
  const filters = {
    limit: 10,
    sortBy: 'rating',
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['topGames', filters],
    queryFn: () => fetchTopGames(filters),
  });

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur : {error.message}</div>;
  if (!data || data.length === 0) return <div>Aucun jeu trouvé.</div>;

  return (
    <div className="TopGameList">
      <h2>Top des jeux</h2>

      <ul>
        {data.map((game) => (
          <li key={game.id || game._id}>
            <h3>{game.name}</h3>
            <h3>{game._id}</h3>
            <p>Released: {game.released}</p>
            <p>Rating: {game.rating}</p>
            <p>Rating Count: {game.ratings_count}</p>
            {game.background_image && (
              <img src={game.background_image} alt={game.name} style={{ width: '200px' }} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopGameList;

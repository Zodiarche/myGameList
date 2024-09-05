import { useQuery } from '@tanstack/react-query';
import { fetchGames } from '../services/api';

const GameList = () => {
  const {
    data: gamesData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['games'],
    queryFn: fetchGames,
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  const games = gamesData?.results;
  console.log(games);

  return (
    <div className="GameList">
      <h2>Liste des jeux</h2>

      <ul>
        {games?.map((game) => (
          <li key={game._id}>
            <h3>{game.name}</h3>
            <p>Released: {game.released}</p>
            <p>Rating: {game.rating}</p>
            <img src={game.background_image} alt={game.name} style={{ width: '200px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;

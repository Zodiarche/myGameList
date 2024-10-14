export const fetchTopGames = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`http://localhost:3000/games/top-games?${params}`);
  if (!response.ok) throw new Error('Network response was not ok');

  const data = await response.json();
  return data;
};

export const fetchGames = async () => {
  const response = await fetch(`http://localhost:3000/games`);
  if (!response.ok) throw new Error('Network response was not ok');

  const data = await response.json();
  return data;
};

export const fetchFilters = async () => {
  const response = await fetch(`http://localhost:3000/games/filters`);
  if (!response.ok) throw new Error('Network response was not ok');

  const data = await response.json();
  return data;
};

export const fetchProfile = async () => {
  const response = await fetch('http://localhost:3000/user/profile', {
    method: 'GET',
    credentials: 'include',
  });

  if (response.ok) return response.json();

  throw new Error(response.status === 401 ? 'Non autorisé' : 'Erreur de serveur');
};

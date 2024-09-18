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
  console.log(response);
  if (!response.ok) throw new Error('Network response was not ok');

  const data = await response.json();
  return data;
};

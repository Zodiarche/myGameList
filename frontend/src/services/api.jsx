export const fetchGames = async () => {
  const response = await fetch("http://localhost:3000/games");
  if (!response.ok) throw new Error("Network response was not ok");

  return response.json();
};

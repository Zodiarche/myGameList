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
  const response = await fetch('http://localhost:3000/user/profile', { method: 'GET', credentials: 'include' });
  if (response.ok) return response.json();

  throw new Error(response.status === 401 ? 'Unauthorized' : 'Erreur de serveur');
};

export const updateUser = async ({ id, username, email, password }) => {
  try {
    const response = await fetch(`http://localhost:3000/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    console.log(JSON.stringify(response, null, 2));

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/user/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

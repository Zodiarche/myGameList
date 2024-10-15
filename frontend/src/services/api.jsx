/**
 * Récupère les jeux les plus populaires avec des filtres optionnels.
 * @param {Object} [filters={}] - Objets contenant les filtres appliqués aux jeux.
 * @returns {Promise<Object>} Les données des jeux populaires filtrés.
 * @throws {Error} Si la réponse du serveur n'est pas correcte ou si aucun jeu n'est trouvé.
 */
export const fetchTopGames = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`http://localhost:3000/games/top-games?${params}`);

  if (!response.ok) {
    if (response.status === 404) throw new Error('Jeu introuvable');
    throw new Error("La réponse réseau n'était pas correcte");
  }

  const data = await response.json();
  return data;
};

/**
 * Récupère la liste de tous les jeux.
 * @returns {Promise<Object>} Les données de tous les jeux disponibles.
 * @throws {Error} Si la réponse du serveur n'est pas correcte ou si aucun jeu n'est trouvé.
 */
export const fetchGames = async () => {
  const response = await fetch(`http://localhost:3000/games`);

  if (!response.ok) {
    if (response.status === 404) throw new Error('Jeux introuvables');
    throw new Error("La réponse réseau n'était pas correcte");
  }

  const data = await response.json();
  return data;
};

/**
 * Récupère les filtres applicables pour la recherche de jeux.
 * @returns {Promise<Object>} Les filtres disponibles pour les jeux.
 * @throws {Error} Si la réponse du serveur n'est pas correcte ou si aucun filtre n'est trouvé.
 */
export const fetchFilters = async () => {
  const response = await fetch(`http://localhost:3000/games/filters`);

  if (!response.ok) {
    if (response.status === 404) throw new Error('Filtres introuvables');
    throw new Error("La réponse réseau n'était pas correcte");
  }

  const data = await response.json();
  return data;
};

/**
 * Récupère les informations du profil utilisateur connecté.
 * @returns {Promise<Object>} Les données du profil utilisateur.
 * @throws {Error} Si l'utilisateur n'est pas autorisé ou s'il y a une erreur de serveur.
 */
export const fetchProfile = async () => {
  const response = await fetch('http://localhost:3000/user/profile', { method: 'GET', credentials: 'include' });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Non autorisé');
    throw new Error('Erreur de serveur');
  }

  return response.json();
};

/**
 * Met à jour les informations d'un utilisateur existant.
 * @param {Object} user - Les informations de l'utilisateur à mettre à jour.
 * @param {number} user.id - L'identifiant de l'utilisateur.
 * @param {string} user.username - Le nom d'utilisateur.
 * @param {string} user.email - L'adresse e-mail de l'utilisateur.
 * @param {string} user.password - Le mot de passe de l'utilisateur.
 * @returns {Promise<Object>} Les données mises à jour de l'utilisateur.
 * @throws {Error} Si la mise à jour échoue ou si une erreur est renvoyée par le serveur.
 */
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Échec de la mise à jour de l'utilisateur");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    throw error;
  }
};

/**
 * Supprime un utilisateur en fonction de son identifiant.
 * @param {number} id - L'identifiant de l'utilisateur à supprimer.
 * @returns {Promise<Object>} Les données de la suppression de l'utilisateur.
 * @throws {Error} Si la suppression échoue ou si une erreur est renvoyée par le serveur.
 */
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
      throw new Error(errorData.message || "Échec de la suppression de l'utilisateur");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    throw error;
  }
};

/**
 * Connecte un utilisateur avec son adresse e-mail et son mot de passe.
 * @param {Object} credentials - Les informations de connexion de l'utilisateur.
 * @param {string} credentials.email - L'adresse e-mail de l'utilisateur.
 * @param {string} credentials.password - Le mot de passe de l'utilisateur.
 * @returns {Promise<Object>} Les données utilisateur après la connexion.
 * @throws {Error} Si la connexion échoue ou si une erreur est renvoyée par le serveur.
 */
export const loginUser = async ({ email, password }) => {
  const response = await fetch('http://localhost:3000/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Échec de la connexion');
  }

  return await response.json();
};

/**
 * Déconnecte l'utilisateur actuellement connecté.
 * @returns {Promise<Object>} Le résultat de la déconnexion.
 * @throws {Error} Si la déconnexion échoue ou si une erreur est renvoyée par le serveur.
 */
export const logoutUser = async () => {
  const response = await fetch('http://localhost:3000/user/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Échec de la déconnexion');
  }

  return response.json();
};

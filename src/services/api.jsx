import { apiUrl } from '../utils/constants';

/**
 * Effectue un appel API avec les paramètres fournis.
 * @param {string} url - L'URL de l'API à appeler.
 * @param {Object} [options={}] - Options pour la requête, telles que la méthode HTTP, le corps, les en-têtes et les informations d'authentification.
 * @param {string} [options.method='GET'] - La méthode HTTP à utiliser (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [options.body] - Le corps de la requête, si nécessaire.
 * @param {Object} [options.headers={}] - Les en-têtes HTTP supplémentaires à ajouter à la requête.
 * @param {string} [options.credentials='include'] - Les informations d'authentification à inclure dans la requête (e.g., cookies).
 * @returns {Promise<Object>} La réponse JSON de l'API.
 * @throws {Error} Si l'appel API échoue ou si une erreur est renvoyée par le serveur.
 */
const apiCall = async (url, { method = 'GET', body, headers = {} } = {}) => {
  try {
    const token = sessionStorage.getItem('token');

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.token) sessionStorage.setItem('token', data.token);

    return data;
  } catch (error) {
    console.error(`Erreur lors de l'appel API à ${url}:`, error.message);
    throw error;
  }
};

/**
 * Recherche les utilisateurs par nom d'utilisateur (username) en fonction de la chaîne de recherche fournie.
 *
 * @param {string} usernameQuery - La chaîne de recherche utilisée pour trouver les utilisateurs par nom d'utilisateur.
 * @returns {Promise<Object[]>} - Retourne une promesse résolue avec une liste d'objets utilisateur correspondant aux critères de recherche.
 * @throws {Error} - Renvoie une erreur si la requête échoue ou si une erreur est renvoyée par le serveur.
 */
export const fetchUsersByUsername = async (usernameQuery) => {
  const params = new URLSearchParams({ query: usernameQuery }).toString();

  return await apiCall(`${apiUrl}/user/search?${params}`);
};

/**
 * Inscrit un nouvel utilisateur avec un nom d'utilisateur, une adresse e-mail et un mot de passe.
 * @param {Object} userData - Les informations de l'utilisateur à inscrire.
 * @param {string} userData.username - Le nom d'utilisateur choisi.
 * @param {string} userData.email - L'adresse e-mail de l'utilisateur.
 * @param {string} userData.password - Le mot de passe de l'utilisateur.
 * @param {Boolean} userData.isAdmin - Si l'utilisateur est un administrateur.
 * @returns {Promise<Object>} Les données utilisateur après l'inscription.
 * @throws {Error} Si l'inscription échoue ou si une erreur est renvoyée par le serveur.
 */
export const signupUser = async ({ username, email, password, isAdmin }) => {
  return await apiCall(`${apiUrl}/user/signup`, {
    method: 'POST',
    body: { username, email, password, isAdmin },
  });
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
  return await apiCall(`${apiUrl}/user/login`, {
    method: 'POST',
    body: { email, password },
  });
};

/**
 * Déconnecte l'utilisateur actuellement connecté.
 * @returns {Promise<Object>} Le résultat de la déconnexion.
 * @throws {Error} Si la déconnexion échoue ou si une erreur est renvoyée par le serveur.
 */
export const logoutUser = async () => {
  return await apiCall(`${apiUrl}/user/logout`, { method: 'POST' });
};

/**
 * Suit un utilisateur en fonction de son identifiant.
 * @param {string} userIdToFollow - L'identifiant de l'utilisateur à suivre.
 * @returns {Promise<Object>} Les données mises à jour de l'utilisateur après le suivi.
 * @throws {Error} Si le suivi échoue ou si une erreur est renvoyée par le serveur.
 */
export const followUser = async (userIdToFollow) => {
  return await apiCall(`${apiUrl}/user/${userIdToFollow}/follow`, {
    method: 'POST',
  });
};

/**
 * Récupère les informations du profil utilisateur connecté.
 * @returns {Promise<Object>} Les données du profil utilisateur.
 * @throws {Error} Si l'utilisateur n'est pas autorisé ou s'il y a une erreur de serveur.
 */
export const fetchProfile = async () => {
  return await apiCall(`${apiUrl}/user/profile`, { method: 'GET' });
};

/**
 * Récupère les informations d'un utilisateur en fonction de son identifiant.
 * @param {string} userId - L'identifiant de l'utilisateur à récupérer.
 * @returns {Promise<Object>} Les données de l'utilisateur.
 * @throws {Error} Si l'appel échoue ou si une erreur est renvoyée par le serveur.
 */
export const fetchUserById = async (userId) => {
  return await apiCall(`${apiUrl}/user/${userId}`, { method: 'GET' });
};

/**
 * Met à jour les informations d'un utilisateur existant.
 * @param {Object} user - Les informations de l'utilisateur à mettre à jour.
 * @param {number} user.id - L'identifiant de l'utilisateur.
 * @param {string} user.username - Le nom d'utilisateur.
 * @param {string} user.email - L'adresse e-mail de l'utilisateur.
 * @param {string} user.oldPassword - L'ancien mot de passe de l'utilisateur.
 * @param {string} user.newPassword - Le nouveau mot de passe de l'utilisateur.
 * @param {string} user.confirmPassword - La confirmation du nouveau mot de passe de l'utilisateur.
 * @returns {Promise<Object>} Les données mises à jour de l'utilisateur.
 * @throws {Error} Si la mise à jour échoue ou si une erreur est renvoyée par le serveur.
 */
export const updateUser = async ({ id, username, email, oldPassword, newPassword, confirmPassword }) => {
  const body = {};
  if (username) body.username = username;
  if (email) body.email = email;
  if (oldPassword || newPassword || confirmPassword) {
    body.oldPassword = oldPassword;
    body.newPassword = newPassword;
    body.confirmPassword = confirmPassword;
  }

  return await apiCall(`${apiUrl}/user/${id}`, {
    method: 'PUT',
    body,
  });
};

/**
 * Supprime un utilisateur en fonction de son identifiant.
 * @param {number} id - L'identifiant de l'utilisateur à supprimer.
 * @returns {Promise<Object>} Les données de la suppression de l'utilisateur.
 * @throws {Error} Si la suppression échoue ou si une erreur est renvoyée par le serveur.
 */
export const deleteUser = async (id) => {
  return await apiCall(`${apiUrl}/user/${id}`, { method: 'DELETE' });
};

/**
 * Crée un nouveau jeu avec les données fournies.
 * @param {Object} gameData - Les données du jeu à créer.
 * @returns {Promise<Object>} Les données du jeu créé.
 * @throws {Error} Si l'appel échoue ou si une erreur est renvoyée par le serveur.
 */
export const createGameData = async (gameData) => {
  return await apiCall(`${apiUrl}/games`, {
    method: 'POST',
    body: gameData,
  });
};

/**
 * Récupère la liste de tous les jeux.
 * @returns {Promise<Object>} Les données de tous les jeux disponibles.
 * @throws {Error} Si la réponse du serveur n'est pas correcte ou si aucun jeu n'est trouvé.
 */
export const fetchGames = async () => {
  return await apiCall(`${apiUrl}/games`);
};

/**
 * Récupère les jeux les plus populaires avec des filtres optionnels.
 * @param {Object} [filters={}] - Objets contenant les filtres appliqués aux jeux.
 * @returns {Promise<Object>} Les données des jeux populaires filtrés.
 * @throws {Error} Si la réponse du serveur n'est pas correcte ou si aucun jeu n'est trouvé.
 */
export const fetchTopGames = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return await apiCall(`${apiUrl}/games/top-games?${params}`);
};

/**
 * Récupère un jeu en fonction de son identifiant.
 * @param {number} id - L'identifiant du jeu à récupérer.
 * @returns {Promise<Object>} Les données du jeu.
 * @throws {Error} Si l'appel échoue ou si une erreur est renvoyée par le serveur.
 */
export const fetchGameById = async (id) => {
  return await apiCall(`${apiUrl}/games/${id}`);
};

/**
 * Met à jour les données d'un jeu existant.
 * @param {Object} gameData - Les données du jeu à mettre à jour.
 * @returns {Promise<Object>} Les données du jeu mis à jour.
 * @throws {Error} Si l'appel échoue ou si une erreur est renvoyée par le serveur.
 */
export const updateGameData = async (gameData) => {
  return await apiCall(`${apiUrl}/games/${gameData.id}`, {
    method: 'PUT',
    body: gameData,
  });
};

/**
 * Supprime un jeu en fonction de son identifiant.
 * @param {string} gameId - L'identifiant du jeu à supprimer.
 * @returns {Promise<Object>} Les données de la suppression.
 * @throws {Error} Si la suppression échoue ou si une erreur est renvoyée par le serveur.
 */
export const deleteGameData = async (gameId) => {
  return await apiCall(`${apiUrl}/games/${gameId}`, { method: 'DELETE' });
};

/**
 * Crée un nouvel utilisateur de jeu avec les données fournies.
 * @param {Object} gameData - Les données de l'utilisateur de jeu.
 * @returns {Promise<Object>} Les données de l'utilisateur de jeu créé.
 * @throws {Error} Si l'appel échoue ou si une erreur est renvoyée par le serveur.
 */
export const createGameUser = async (gameData) => {
  return await apiCall(`${apiUrl}/games-user`, {
    method: 'POST',
    body: gameData,
  });
};

/**
 * Récupère la liste des utilisateurs associés aux jeux.
 * @returns {Promise<Object>} Les données des utilisateurs de jeux.
 * @throws {Error} Si l'appel échoue ou si une erreur est renvoyée par le serveur.
 */
export const fetchGameUsers = async () => {
  return await apiCall(`${apiUrl}/games-user`);
};

/**
 * Récupère la bibliothèque de jeux d'un utilisateur suivi par son identifiant.
 * @param {string} userId - L'identifiant de l'utilisateur dont la bibliothèque doit être récupérée.
 * @returns {Promise<Object[]>} - Retourne une liste des jeux dans la bibliothèque de l'utilisateur.
 * @throws {Error} - Renvoie une erreur si la requête échoue ou si une erreur est renvoyée par le serveur.
 */
export const fetchUserLibrary = async (userId) => {
  return await apiCall(`${apiUrl}/games-user/library/${userId}`, {
    method: 'GET',
  });
};

/**
 * Récupère un jeu en fonction de son identifiant.
 * @param {number} id - L'identifiant du jeu à récupérer.
 * @returns {Promise<Object>} Les données du jeu.
 * @throws {Error} Si l'appel échoue ou si une erreur est renvoyée par le serveur.
 */
export const fetchGameUserById = async (idGame, idUser) => {
  return await apiCall(`${apiUrl}/games-user/${idGame}?userId=${idUser}`);
};

/**
 * Met à jour les données d'un utilisateur de jeu existant.
 * @param {Object} gameData - Les données à jour de l'utilisateur de jeu.
 * @returns {Promise<Object>} Les données de l'utilisateur de jeu mis à jour.
 * @throws {Error} Si l'appel échoue ou si une erreur est renvoyée par le serveur.
 */
export const updateGameUser = async (gameData) => {
  return await apiCall(`${apiUrl}/games-user/${gameData.id}`, {
    method: 'PUT',
    body: gameData,
  });
};

/**
 * Supprime un jeu de la bibliothèque d'un utilisateur.
 * @param {number} gameUserId - L'identifiant du jeu utilisateur à supprimer.
 * @returns {Promise<Object>} Les données de la suppression.
 * @throws {Error} Si la suppression échoue ou si une erreur est renvoyée par le serveur.
 */
export const deleteGameUser = async (gameUserId) => {
  return await apiCall(`${apiUrl}/games-user/${gameUserId}`, { method: 'DELETE' });
};

/**
 * Fonction de requête asynchrone pour récupérer les jeux à partir d'une API en fonction de la recherche.
 *
 * @param {string} searchQuery - La chaîne de recherche utilisée pour trouver les jeux.
 * @returns {Promise<Object[]>} - Retourne une promesse qui se résout en une liste de jeux sous forme d'objet JSON.
 * @throws {Error} Si l'appel échoue ou si une erreur est renvoyée par le serveur.
 */
export const fetchGamesBySearch = async (searchQuery) => {
  const params = new URLSearchParams({ search: searchQuery }).toString();
  return await apiCall(`${apiUrl}/games/search?${params}`);
};

/**
 * Récupère les filtres applicables pour la recherche de jeux.
 * @returns {Promise<Object>} Les filtres disponibles pour les jeux.
 * @throws {Error} Si la réponse du serveur n'est pas correcte ou si aucun filtre n'est trouvé.
 */
export const fetchFilters = async () => {
  return await apiCall(`${apiUrl}/games/filters`);
};

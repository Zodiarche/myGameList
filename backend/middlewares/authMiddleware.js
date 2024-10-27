import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

/**
 * Vérifie si l'utilisateur est authentifié.
 *
 * @param {Express.Request} request - L'objet de la requête.
 * @param {Express.Response} response - L'objet de la réponse.
 * @param {Function} next - La fonction de middleware suivante dans la pile.
 */
export const isAuthenticated = async (request, response, next) => {
  const token = getTokenFromCookies(request.cookies);

  if (!token) {
    return response.status(401).json({ message: 'Accès refusé, pas de token fourni' });
  }

  try {
    const decoded = await verifyToken(token);
    request.userData = decoded;
    next();
  } catch (err) {
    return response.status(403).json({ message: 'Token invalide ou expiré' });
  }
};

/**
 * Vérifie si l'utilisateur est administrateur.
 *
 * @param {Express.Request} request - L'objet de la requête.
 * @param {Express.Response} response - L'objet de la réponse.
 * @param {Function} next - La fonction de middleware suivante dans la pile.
 */
export const isAdmin = (request, response, next) => {
  if (request.userData && request.userData.isAdmin) {
    next();
  } else {
    return response.status(403).json({ message: 'Accès refusé, privilèges insuffisants' });
  }
};

/**
 * Vérifie si l'utilisateur est soit le propriétaire de la ressource, soit un administrateur.
 *
 * @param {Express.Request} request - L'objet de la requête.
 * @param {Express.Response} response - L'objet de la réponse.
 * @param {Function} next - La fonction middleware suivante dans la pile.
 */ export const isSelfOrAdmin = (request, response, next) => {
  const userId = request.params.id;
  const requestUserId = request.userData.userId;
  const isAdmin = request.userData.isAdmin;

  // Vérifie si l'utilisateur est soit un admin, soit le propriétaire de la ressource
  if (isAdmin || userId === requestUserId) {
    next();
  } else {
    return response.status(403).json({ message: 'Accès refusé, privilèges insuffisants' });
  }
};

/**
 * Extrait le token des cookies de la requête.
 *
 * @param {Object} cookies - Les cookies de la requête.
 * @returns {string|null} Le token ou null s'il n'est pas trouvé.
 */
const getTokenFromCookies = (cookies) => {
  return cookies?.token || null;
};

/**
 * Vérifie le token JWT.
 *
 * @param {string} token - Le token à vérifier.
 * @returns {Promise<Object>} - Les données décodées du token.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

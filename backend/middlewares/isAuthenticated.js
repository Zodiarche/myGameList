import dotenv from "dotenv";
import jwt from "jsonwebtoken";

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
    return response
      .status(401)
      .json({ message: "Accès refusé, pas de token fourni" });
  }

  try {
    const decoded = await verifyToken(token);
    request.userData = decoded;
    next();
  } catch (err) {
    return response.status(401).json({ message: "Token invalide ou expiré" });
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
  console.log(process.env.JWT_SECRET);

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

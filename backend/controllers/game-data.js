import GameData from "../models/game-data.js";
import { normalizeString } from "../utils/normalizeString.js";

/**
 * Crée un nouveau GameData.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const createGameData = async (req, res) => {
  const gameData = new GameData(req.body);

  try {
    const savedGameData = await gameData.save();
    res.status(201).json(savedGameData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Récupère la liste de tous les GameData.
 * @param {Express.Request} _ - L'objet de requête (non utilisé).
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getGameDataList = async (_, res) => {
  try {
    const gameDataList = await GameData.find();
    res.json(gameDataList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère une liste des jeux filtrés selon certains critères et triés.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getTopGames = async (req, res) => {
  try {
    const { limit = 10, platform, tag, rating, released } = req.query;
    const limitNum = parseInt(limit, 10);
    const filters = {};

    // Ajouter les filtres pour les paramètres de requête
    if (platform) {
      filters["platforms.name"] = platform;
    }

    if (tag) {
      filters["tags.name"] = tag;
    }

    if (rating) {
      filters["rating"] = { $gte: parseFloat(rating) };
    }

    if (released) {
      filters["released"] = { $gte: new Date(released) };
    }

    // Récupérer les jeux les plus notés
    const mostRatedGames = await GameData.find(filters)
      .sort({ ratings_count: -1 }) // Trier par nombre de notations d'abord
      .limit(limitNum * 2); // Limiter le nombre initial à une taille plus grande pour filtrer plus tard

    // Trier par note parmi les jeux les plus notés
    const topRatedGames = mostRatedGames.sort((a, b) => b.rating - a.rating);

    // Limiter le résultat final au nombre demandé
    const topGames = topRatedGames.slice(0, limitNum);

    res.json(topGames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Recherche de jeux par nom avec support pour les accents et la casse.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const searchGames = async (req, res) => {
  try {
    const searchQuery = req.query.search ? req.query.search : "";
    const normalizedQuery = normalizeString(searchQuery);

    const gameDataList = await GameData.find({
      name: { $regex: new RegExp(`.*${normalizedQuery}.*`, "i") },
    });

    res.json(gameDataList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère un GameData par ID.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getGameDataById = async (req, res) => {
  try {
    const gameData = await GameData.findById(req.params.id);
    if (!gameData) return res.status(404).json({ message: "Jeu non trouvé" });

    res.json(gameData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Met à jour un GameData par ID.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const updateGameData = async (req, res) => {
  try {
    const updatedGameData = await GameData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedGameData)
      return res.status(404).json({ message: "Jeu non trouvé" });

    res.json(updatedGameData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Supprime un GameData par ID.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const deleteGameData = async (req, res) => {
  try {
    const deletedGameData = await GameData.findByIdAndDelete(req.params.id);
    if (!deletedGameData)
      return res.status(404).json({ message: "Jeu non trouvé" });

    res.json({ message: "Jeu supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

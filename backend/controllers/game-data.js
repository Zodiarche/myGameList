import GameData from "../models/game-data.js";

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

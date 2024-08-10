import GameUser from "../models/game-user.js";

/**
 * Crée un nouveau GameUser.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const createGameUser = async (req, res) => {
  const gameUser = new GameUser(req.body);

  try {
    const savedGameUser = await gameUser.save();
    res.status(201).json(savedGameUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Récupère la liste de tous les GameUsers.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getGameUsers = async (req, res) => {
  try {
    const gameUserList = await GameUser.find().populate("idUser idGameBD");

    res.json(gameUserList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère un GameUser par ID.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getGameUserById = async (req, res) => {
  try {
    const gameUser = await GameUser.findById(req.params.id).populate("idUser idGameBD");
    if (!gameUser) return res.status(404).json({ message: "GameUser non trouvé" });

    res.json(gameUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Met à jour un GameUser par ID.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const updateGameUser = async (req, res) => {
  try {
    const updatedGameUser = await GameUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGameUser) return res.status(404).json({ message: "GameUser non trouvé" });

    res.json(updatedGameUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Supprime un GameUser par ID.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const deleteGameUser = async (req, res) => {
  try {
    const deletedGameUser = await GameUser.findByIdAndDelete(req.params.id);
    if (!deletedGameUser) return res.status(404).json({ message: "GameUser non trouvé" });

    res.json({ message: "GameUser supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

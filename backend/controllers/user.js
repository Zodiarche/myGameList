import user from "../models/user.js";

/**
 * Crée un nouvel user.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const createUser = async (req, res) => {
  const user = new user(req.body);

  try {
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Récupère la liste de tous les users.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getUsers = async (_, res) => {
  try {
    const users = await user.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère un user par ID.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getUserById = async (req, res) => {
  try {
    const user = await user.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Met à jour un user par ID.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Supprime un user par ID.
 * @param {Express.Request} req - L'objet de requête.
 * @param {Express.Response} res - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await user.findByIdAndDelete(req.params.id );
    if (!deletedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

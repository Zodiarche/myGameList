import user from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = async (request, response) => {
  const { email, password } = request.body;

  try {
    const existingUser = await user.findOne({ email });
    if (!existingUser) return response.status(404).json({ message: 'Utilisateur non trouvé' });

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) return response.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ userId: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    response.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    response.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Récupère le profil de l'utilisateur authentifié.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getUserProfile = async (request, response) => {
  try {
    const requestUserData = request.userData;

    const userDatabase = await user.findById(requestUserData.userId);
    if (!userDatabase) return response.status(404).json({ message: 'Utilisateur non trouvé' });

    response.json(userDatabase);
  } catch (error) {
    response.status(500).json({
      message: 'Erreur lors de la récupération du profil utilisateur',
    });
  }
};

/**
 * Crée un nouvel user.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const createUser = async (request, response) => {
  const { username, email, password } = request.body;

  try {
    // Vérification si l'utilisateur existe déjà
    const existingUser = await user.findOne({ email });
    if (existingUser) return response.status(400).json({ message: 'Cet utilisateur existe déjà.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    response.status(201).json(savedUser);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

/**
 * Récupère la liste de tous les users.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getUsers = async (_, response) => {
  try {
    const users = await user.find();

    response.json(users);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Récupère un user par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const getUserById = async (request, response) => {
  try {
    const user = await user.findById(request.params.id);
    if (!user) return response.status(404).json({ message: 'Utilisateur non trouvé' });

    response.json(user);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

/**
 * Met à jour un user par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const updateUser = async (request, response) => {
  try {
    const { oldPassword, newPassword, ...otherUpdates } = request.body;

    const existingUser = await user.findById(request.params.id);
    if (!existingUser) return response.status(404).json({ message: 'Utilisateur non trouvé' });

    if (oldPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);
      if (!isPasswordValid) return response.status(400).json({ message: 'Ancien mot de passe incorrect.' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      otherUpdates.password = hashedPassword;
    }

    const updatedUser = await user.findByIdAndUpdate(request.params.id, { $set: otherUpdates }, { new: true });
    if (!updatedUser) return response.status(404).json({ message: 'Utilisateur non trouvé' });

    response.json(updatedUser);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

/**
 * Supprime un user par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const deleteUser = async (request, response) => {
  try {
    const deletedUser = await user.findByIdAndDelete(request.params.id);
    if (!deletedUser) return response.status(404).json({ message: 'Utilisateur non trouvé' });

    response.clearCookie('token', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    response.json({ message: 'Utilisateur supprimé et token effacé' });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

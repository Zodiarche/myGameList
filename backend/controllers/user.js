import user from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { isAdminValid, isEmailValid, isPasswordValid, isUsernameValid } from '../utils/formValidate.js';

export const loginUser = async (request, response) => {
  const { email, password } = request.body;

  try {
    const existingUser = await user.findOne({ email });
    if (!existingUser) return response.status(400).json({ message: 'Identifiants incorrects' });

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) return response.status(400).json({ message: 'Identifiants incorrects' });

    const token = jwt.sign({ userId: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1y' });

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
 * Crée un nouvel utilisateur après vérification des données du formulaire.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const createUser = async (request, response) => {
  const { username, email, password, isAdmin } = request.body;

  const usernameError = isUsernameValid(username);
  if (usernameError) return response.status(400).json({ field: 'username', message: usernameError });

  const emailError = isEmailValid(email);
  if (emailError) return response.status(400).json({ field: 'email', message: emailError });

  const passwordError = isPasswordValid(password);
  if (passwordError) return response.status(400).json({ field: 'password', message: passwordError });

  const isAdminError = isAdminValid(isAdmin);
  if (isAdminError) return response.status(400).json({ field: 'isAdmin', message: isAdminError });

  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) return response.status(400).json({ message: 'Cet utilisateur existe déjà.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({ username, email, password: hashedPassword, isAdmin });
    const savedUser = await newUser.save();

    response.status(201).json(savedUser);
  } catch (error) {
    response.status(500).json({ message: error.message });
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
 * Met à jour un utilisateur par ID.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const updateUser = async (request, response) => {
  try {
    const { username, email, oldPassword, newPassword, confirmPassword, ...otherUpdates } = request.body;

    const existingUser = await user.findById(request.params.id);
    if (!existingUser) return response.status(404).json({ message: 'Utilisateur non trouvé' });

    const usernameError = isUsernameValid(username);
    if (usernameError) return response.status(400).json({ message: usernameError });

    const emailError = isEmailValid(email);
    if (emailError) return response.status(400).json({ message: emailError });

    if (oldPassword || newPassword || confirmPassword) {
      const isOldPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);
      if (!isOldPasswordValid) return response.status(400).json({ message: 'Ancien mot de passe incorrect.' });

      const passwordError = isPasswordValid(newPassword);
      if (passwordError) return response.status(400).json({ message: passwordError });

      if (newPassword !== confirmPassword) return response.status(400).json({ message: 'Le nouveau mot de passe et la confirmation ne correspondent pas.' });
      if (oldPassword === newPassword) return response.status(400).json({ message: "Le nouveau mot de passe ne peut pas être le même que l'ancien." });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      otherUpdates.password = hashedPassword;
    }

    if (existingUser.username === username && existingUser.email === email && !oldPassword && !newPassword && !confirmPassword) {
      return response.status(400).json({ message: 'Aucune modification n’a été effectuée.' });
    }

    const updatedUser = await user.findByIdAndUpdate(request.params.id, { $set: { username, email, ...otherUpdates } }, { new: true });
    if (!updatedUser) return response.status(404).json({ message: 'Échec de la mise à jour de l’utilisateur' });

    response.json(updatedUser);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Une erreur interne est survenue.' });
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

/**
 * Deconnecte un user.
 * @param {Express.Request} request - L'objet de requête.
 * @param {Express.Response} response - L'objet de réponse.
 * @returns {Promise<void>}
 */
export const logoutUser = async (_, response) => {
  response.clearCookie('token', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });

  response.status(200).json({ message: 'Déconnexion réussie, token effacé.' });
};

import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser, getUserProfile, logoutUser } from '../controllers/user.js';
import { isAdmin, isAuthenticated, isSelfOrAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Récupération de tous les users
router.get('/', isAdmin, getUsers);

// Route pour l'inscription
router.post('/signup', createUser);

// Route pour la connexion
router.post('/login', loginUser);

// Route pour la déconnexion
router.post('/logout', isAuthenticated, logoutUser);

// Route protégée pour obtenir le profil de l'utilisateur
router.get('/profile', isAuthenticated, getUserProfile);

// Récupération d'un user par ID
router.get('/:id', isSelfOrAdmin, getUserById);

// Mise à jour d'un user
router.put('/:id', isSelfOrAdmin, updateUser);

// Suppression d'un user
router.delete('/:id', isSelfOrAdmin, deleteUser);

export default router;

import express from 'express';
import { createGameUser, getGameUsers, getGameUserById, updateGameUser, deleteGameUser } from '../controllers/game-user.js';
import { isAdmin, isSelfOrAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Création d'un nouveau GameUser
router.post('/', createGameUser);

// Récupération de tous les GameUsers
router.get('/', isAdmin, getGameUsers);

// Récupération d'un GameUser par ID
router.get('/:id', isSelfOrAdmin, getGameUserById);

// Mise à jour d'un GameUser
router.put('/:id', isSelfOrAdmin, updateGameUser);

// Suppression d'un GameUser
router.delete('/:id', isSelfOrAdmin, deleteGameUser);

export default router;

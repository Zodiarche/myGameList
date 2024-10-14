import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getUserProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Récupération de tous les users
router.get("/", getUsers);

// Route pour l'inscription
router.post("/signup", createUser);

// Route pour la connexion
router.post("/login", loginUser);

// Route protégée pour obtenir le profil de l'utilisateur
router.get("/profile", isAuthenticated, getUserProfile);

// Récupération d'un user par ID
router.get("/:id", getUserById);

// Mise à jour d'un user
router.put("/:id", updateUser);

// Suppression d'un user
router.delete("/:id", deleteUser);

export default router;

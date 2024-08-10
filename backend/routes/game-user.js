import express from "express";
import {
  createGameUser,
  getGameUsers,
  getGameUserById,
  updateGameUser,
  deleteGameUser,
} from "../controllers/game-user.js";

const router = express.Router();

// Création d'un nouveau GameUser
router.post("/", createGameUser);

// Récupération de tous les GameUsers
router.get("/", getGameUsers);

// Récupération d'un GameUser par ID
router.get("/:id", getGameUserById);

// Mise à jour d'un GameUser
router.put("/:id", updateGameUser);

// Suppression d'un GameUser
router.delete("/:id", deleteGameUser);

export default router;

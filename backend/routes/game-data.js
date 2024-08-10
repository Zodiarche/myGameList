import express from "express";
import {
  createGameData,
  getGameDataList,
  getGameDataById,
  updateGameData,
  deleteGameData,
} from "../controllers/game-data.js";

const router = express.Router();

// Création d'un nouveau jeu
router.post("/", createGameData);

// Récupération de tous les jeux
router.get("/", getGameDataList);

// Récupération d'un jeu par ID
router.get("/:id", getGameDataById);

// Mise à jour d'un jeu
router.put("/:id", updateGameData);

// Suppression d'un jeu
router.delete("/:id", deleteGameData);

export default router;

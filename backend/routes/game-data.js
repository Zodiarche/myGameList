import express from "express";
import {
  createGameData,
  getGameDataList,
  getTopGames,
  getGameDataById,
  updateGameData,
  deleteGameData,
  searchGames,
} from "../controllers/game-data.js";

const router = express.Router();

// Création d'un nouveau jeu
router.post("/", createGameData);

// Récupération de tous les jeux
router.get("/", getGameDataList);

// Recherche de jeux
router.get("/search", searchGames);

// Récupération les meilleurs jeux
router.get("/top-games", getTopGames);

// Récupération d'un jeu par ID
router.get("/:id", getGameDataById);

// Mise à jour d'un jeu
router.put("/:id", updateGameData);

// Suppression d'un jeu
router.delete("/:id", deleteGameData);

export default router;

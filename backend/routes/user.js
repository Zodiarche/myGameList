import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.js";

const router = express.Router();

// Création d'un nouvel user
router.post("/", createUser);

// Récupération de tous les users
router.get("/", getUsers);

// Récupération d'un user par ID
router.get("/:id", getUserById);

// Mise à jour d'un user
router.put("/:id", updateUser);

// Suppression d'un user
router.delete("/:id", deleteUser);

export default router;

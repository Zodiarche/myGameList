import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.js";
import gamesRoutes from "./routes/game-data.js";
import gamesUserRoutes from "./routes/game-user.js";
// import { saveGamesToDB } from "./import-games.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/myGameList")
  .then(() => {
    console.log("Connecté à MongoDB avec succès !");
    // return saveGamesToDB();
  })
  .then(() => {
    // console.log("L'importation des jeux est terminée.");
    app.listen(port, () =>
      console.log(`Serveur démarré sur http://localhost:${port}`)
    );
  })
  .catch((error) =>
    console.error(
      "Erreur lors de la connexion à MongoDB ou lors de l'importation des jeux :",
      error
    )
  );

app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/games", gamesRoutes);
app.use("/games-user", gamesUserRoutes);

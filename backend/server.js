// Modules tiers
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Modules personnalisés
import userRoutes from './routes/user.js';
import gamesRoutes from './routes/game-data.js';
import gamesUserRoutes from './routes/game-user.js';
import { isAuthenticated } from './middlewares/isAuthenticated.js';
import { saveGamesToDB } from './import-games.js';

dotenv.config();

const PORT = process.env.PORT;
const app = express();

/**
 * Configuration de la connexion à MongoDB.
 */
mongoose
  .connect('mongodb://localhost:27017/myGameList')
  .then(
    /*async*/ () => {
      console.log('Connected to MongoDB');
      // await saveGamesToDB();
    }
  )
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/games', gamesRoutes);
app.use('/games-user', isAuthenticated, gamesUserRoutes);

/**
 * Démarrage du serveur.
 */
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

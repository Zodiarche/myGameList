import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.js";
import gameDataRoutes from "./routes/game-data.js";
import gameUserRoutes from "./routes/game-user.js";

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/votreDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/gamedata", gameDataRoutes);
app.use("/gameuser", gameUserRoutes);

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

import mongoose from "mongoose";

const { Schema } = mongoose;

const gameDataSchema = new Schema({
  nom: { type: String, required: true },
  type: { type: String, required: true },
  img: { type: String, required: true },
  idGameBD: { type: String, required: true },
});

export default mongoose.model("game-data", gameDataSchema);

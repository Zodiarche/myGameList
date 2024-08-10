import mongoose from "mongoose";

const { Schema } = mongoose;

const gameUserSchema = new Schema({
  heure: { type: Number, required: true },
  etat: { type: Number, enum: [0, 1, 2, 3], required: true },
  note: { type: Number, required: true },
  idUser: { type: Schema.Types.ObjectId, ref: "user", required: true },
  idGameBD: { type: Schema.Types.ObjectId, ref: "game-user", required: true },
});

export default mongoose.model("game-user", gameUserSchema);

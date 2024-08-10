import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  field1: { type: String, required: true },
  field2: { type: String, required: true },
  field3: { type: String, required: true },
});

export default mongoose.model("user", userSchema);

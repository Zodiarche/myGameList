import mongoose from "mongoose";

const { Schema } = mongoose;

const platformSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  slug: { type: String },
});

const storeSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  slug: { type: String },
});

const ratingSchema = new Schema({
  id: { type: Number },
  title: { type: String },
  count: { type: Number },
  percent: { type: Number },
});

const tagSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  slug: { type: String },
  language: { type: String },
});

const screenshotSchema = new Schema({
  id: { type: Number },
  image: { type: String },
});

const gameDataSchema = new Schema({
  idGameBD: { type: String, required: true },
  slug: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  playtime: { type: Number },
  platforms: [platformSchema],
  stores: [storeSchema],
  released: { type: Date },
  rating: { type: Number },
  ratings: [ratingSchema],
  ratings_count: { type: Number },
  reviews_text_count: { type: Number },
  added: { type: Number },
  added_by_status: {
    yet: { type: Number },
    owned: { type: Number },
    beaten: { type: Number },
    toplay: { type: Number },
    dropped: { type: Number },
    playing: { type: Number },
  },
  metacritic: { type: Number },
  suggestions_count: { type: Number },
  background_image: { type: String },
  tags: [tagSchema],
  esrb_rating: {
    id: { type: Number },
    name: { type: String },
    slug: { type: String },
  },
  short_screenshots: [screenshotSchema],
});

export default mongoose.model("game-data", gameDataSchema);

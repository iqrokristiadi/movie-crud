import mongoose from "mongoose";

const directorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  birthDate: Date,
});

const Director = mongoose.model("Director", directorSchema);
export default Director;

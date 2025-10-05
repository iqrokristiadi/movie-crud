import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  birthDate: Date,
  nationality: String,
});

const Actor = mongoose.model("Actor", actorSchema);

export default Actor;

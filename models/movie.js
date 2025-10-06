import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
  ],
  releaseDate: Date,
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Director",
    required: true,
  },
  actors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
    },
  ],
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;

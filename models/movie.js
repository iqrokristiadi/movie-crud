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
  averageRating: { type: Number, default: 0 },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;

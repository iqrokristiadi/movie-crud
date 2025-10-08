import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

// Prevent duplicate ratings (same user for same movie)
ratingSchema.index({ movie: 1, user: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);

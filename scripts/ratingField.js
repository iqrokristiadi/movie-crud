import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "../models/movie.js";

dotenv.config();
mongoose.connect(process.env.URI).then(async () => {
  await Movie.updateMany(
    { averageRating: { $exists: false } },
    { $set: { averageRating: 0 } }
  );
  console.log("✅ Added averageRating to all movies");
  mongoose.connection.close();
});

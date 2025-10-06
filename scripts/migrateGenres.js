import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "../models/movie.js";
import Genre from "../models/genre.js";

dotenv.config(); // loads .env file

const migrateGenres = async () => {
  try {
    console.log("Connectiong to MongoDB");
    await mongoose.connect(process.env.URI);
    console.log("Connected");

    const movies = await Movie.find();

    for (const movie of movies) {
      // if movie.genre exists and it's a string
      if (typeof movie.genre === "string" && movie.genre.trim() !== "") {
        // handle multiple, e.g. "Action, Drama"
        const genreNames = movie.genre.split(",").map((g) => g.trim());
        const genreIds = [];

        for (const name of genreNames) {
          // find or create the genre
          let genreDoc = await Genre.findOne({ name });
          if (!genreDoc) {
            genreDoc = await Genre.create({ name });
            console.log(`Create new genre: ${name}`);
          }
          genreIds.push(genreDoc._id);
        }

        // assign genre array to movie
        movie.genres = genreIds;
        movie.genre = undefined; //remove old field
        await movie.save();

        console.log(`Updated movie: ${movie.title}`);
      }
    }

    console.log("Migration Completed");
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

migrateGenres();

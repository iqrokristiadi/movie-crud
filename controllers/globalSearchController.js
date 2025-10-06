import Movie from "../models/movie.js";
import Actor from "../models/actor.js";
import Director from "../models/director.js";

export const globalSearch = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please Provide a Search Keyword",
      });
    }

    // Case-insensitive regex pattern
    const regex = { $regex: keyword, $options: "i" };

    // Search across collections
    const [movies, directors, actors] = await Promise.all([
      Movie.find({ title: regex })
        .select("title releaseDate -_id")
        .populate("director", "name -_id")
        .populate("actors", "name -_id")
        .populate("genre", "name -_id"),
      Director.find({ name: regex }).select("name bio"),
      Actor.find({ name: regex }).select("name bio"),
    ]);

    // For each actor found, find their movies
    const actorsWithMovies = await Promise.all(
      actors.map(async (actor) => {
        const actorMovies = await Movie.find({
          actors: { $in: [actor._id] },
        }).select("title releaseDate -_id");
        return {
          ...actor.toObject(),
          movies: actorMovies,
        };
      })
    );

    // For each director found, find their movies
    const directorsWithMovies = await Promise.all(
      directors.map(async (d) => {
        const directorMovies = await Movie.find({
          director: d._id,
        }).select("title releaseDate -_id");
        return {
          ...d.toObject(),
          movies: directorMovies,
        };
      })
    );

    res.json({
      success: true,
      data: {
        movies,
        actors: actorsWithMovies,
        directors: directorsWithMovies,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
      Movie.find({ title: regex }).select("title releaseDate -_id"),
      Director.find({ name: regex }).select("name bio -_id"),
      Actor.find({ name: regex }).select("name bio -_id"),
    ]);

    res.json({
      success: true,
      data: { movies, actors, directors },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

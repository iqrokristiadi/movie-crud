import Movie from "../models/movie.js";
import Director from "../models/director.js";
import Genre from "../models/genre.js";

export const filterMovies = async (req, res) => {
  try {
    const { genre, director, year } = req.query; //Get Query Params

    const filter = {}; //Dynamic filter object

    // Filter by year (using releaseDate)
    if (year) {
      const yearStart = new Date(`${year}-01-01`);
      const yearEnd = new Date(`${year}-12-31`);
      filter.releaseDate = { $gte: yearStart, $lte: yearEnd };
    }

    // Filter by genre name
    if (genre) {
      const foundGenre = await Genre.findOne({
        name: { $regex: genre, $options: "i" },
      });
      if (foundGenre) filter.genre = foundGenre._id;
    }

    // Filter by director name
    if (director) {
      const foundDirector = await Director.findOne({
        name: { $regex: director, $options: "i" },
      });
      if (foundDirector) filter.director = foundDirector._id;
    }

    // Run the query
    const movies = await Movie.find(filter)
      .populate("director", "name -_id")
      .populate("actors", "name -_id")
      .populate("genre", "name -_id");

    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

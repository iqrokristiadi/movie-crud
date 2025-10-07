import Movie from "../models/movie.js";
import Director from "../models/director.js";
import Genre from "../models/genre.js";

export const filterMovies = async (req, res) => {
  try {
    const { genre, director, year, page = 1, limit = 5 } = req.query; //Get Query Params

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

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum; //skip formula

    // Query total count (for total pages info)
    const totalMovies = await Movie.countDocuments(filter);

    // Run the query
    const movies = await Movie.find(filter)
      .populate("director", "name -_id")
      .populate("actors", "name -_id")
      .populate("genre", "name -_id")
      .skip(skip) //skip some docs
      .limit(limitNum); //limit the amount per page

    const totalPages = Math.ceil(totalMovies / limitNum);

    // Build pagination URLs dynamically
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
      req.path
    }`;
    const nextPage =
      pageNum < totalPages
        ? `${baseUrl}?page=${pageNum + 1}&limit=${limitNum}`
        : null;
    const prevPage =
      pageNum > 1 ? `${baseUrl}?page=${pageNum - 1}&limit=${limitNum}` : null;

    res.json({
      success: true,
      currentPage: pageNum,
      totalPages,
      totalMovies,
      count: movies.length,
      nextPage,
      prevPage,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

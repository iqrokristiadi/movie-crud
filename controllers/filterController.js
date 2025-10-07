import Movie from "../models/movie.js";
import Director from "../models/director.js";
import Genre from "../models/genre.js";

export const filterMovies = async (req, res) => {
  try {
    const {
      genre,
      director,
      year,
      page = 1,
      limit = 5,
      sort,
      order = "asc",
    } = req.query; //Get Query Params

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

    // Validate sort field here
    const allowedSortField = ["title", "releaseDate", "rating"];
    if (sort && !allowedSortField.includes(sort)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort field. Allowed fields ${allowedSortField.join(
          ", "
        )}`,
      });
    }

    // Query total count (for total pages info)
    const totalMovies = await Movie.countDocuments(filter);

    // Sorting
    let sortOption = {};
    if (sort) {
      // if order=desc -> use -1, otherwise 1
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    // Run the query
    const movies = await Movie.find(filter)
      .populate("director", "name -_id")
      .populate("actors", "name -_id")
      .populate("genre", "name -_id")
      .sort(sortOption) //add sorting
      .skip(skip) //skip some docs
      .limit(limitNum); //limit the amount per page

    // Pagination metadata + keep query params
    const totalPages = Math.ceil(totalMovies / limitNum);

    // Clone Query Params
    const queryParams = { ...req.query };

    // Remove page param (we’ll replace it later)
    delete queryParams.page;

    // Convert query object to a query string (e.g. "genre=Sci-Fi&limit=5")
    const queryString = new URLSearchParams(queryParams).toString();

    // Build pagination URLs dynamically
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
      req.path
    }`;

    // Helper to append query strings correctly
    const buildPageUrl = (page) => {
      const pageParam = `page=${page}`;
      return queryString
        ? `${baseUrl}?${queryString}&${pageParam}`
        : `{baseUrl}?${pageParam}`;
    };

    // Next & Prev
    const nextPage = pageNum < totalPages ? buildPageUrl(pageNum + 1) : null;
    const prevPage = pageNum > 1 ? buildPageUrl(pageNum - 1) : null;

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

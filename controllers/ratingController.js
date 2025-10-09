import Rating from "../models/rating.js";
import Movie from "../models/movie.js";

// =============================
// Add or Update Rating
// =============================

export const rateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating } = req.body;
    const userId = req.user._id; // from protect middleware

    // Check movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Check if user already rated this movie
    let userRating = await Rating.findOne({ movie: movieId, user: userId });

    if (userRating) {
      // Update existing rating
      userRating.rating = rating;
      await userRating.save();
    } else {
      // Create new rating
      userRating = await Rating.create({
        movie: movieId,
        user: userId,
        rating,
      });
    }

    // Calculate average rating
    const allRatings = await Rating.find({ movie: movieId });
    const avg =
      allRatings.reduce((acc, curr) => acc + curr.rating, 0) /
      allRatings.length;

    // Optional: store average rating in Movie model
    movie.averageRating = avg.toFixed(1);
    await movie.save();

    res.json({
      success: true,
      message: "Rating submitted successfully",
      data: {
        userRating,
        averageRating: movie.averageRating,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserRateMovies = async (req, res) => {
  try {
    // Find all ratings made by the logged-in user
    const userRatings = await Rating.find({ user: req.user._id })
      .populate({
        path: "movie",
        select: "title releaseDate averageRating director genre",
        populate: [
          { path: "director", select: "name" },
          { path: "genre", select: "name" },
        ],
      })
      .select("rating");

    if (userRatings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You haven't rated any movies yet",
      });
    }

    // Transform the response
    const ratedMovies = userRatings.map((r) => ({
      movie: r.movie,
      userRating: r.rating,
    }));

    res.json({
      success: true,
      count: ratedMovies.length,
      data: ratedMovies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

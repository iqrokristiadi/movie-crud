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

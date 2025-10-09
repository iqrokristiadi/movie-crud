import User from "../models/user.js";
import Movie from "../models/movie.js";

// Add to favorites
export const addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    // Movie not found
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    // Avoid duplicates
    if (user.favoriteMovies.includes(movieId)) {
      return res
        .status(400)
        .json({ success: false, message: "Movie already in favorite" });
    }

    user.favoriteMovies.push(movieId);
    await user.save();

    res.status(200).json({ success: true, message: "Added to favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's favorites movie
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favoriteMovies");
    res.status(200).json({
      success: true,
      count: user.favoriteMovies.length,
      favorites: user.favoriteMovies,
    });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

// Remove from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { movieId } = req.params;

    user.favoriteMovies = user.favoriteMovies.filter(
      (id) => id.toString() !== movieId
    );

    await user.save();

    res.status(400).json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

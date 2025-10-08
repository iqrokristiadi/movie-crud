import User from "../models/user.js";
import Movie from "../models/movie.js";

// Add movie to watchlist
export const addToWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const movieId = req.params.movieId;

    // Check if movie exist
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    // Prevent duplicates
    if (user.watchlist.includes(movieId)) {
      return res
        .status(400)
        .json({ success: false, message: "Already in watchlist" });
    }

    user.watchlist.push(movieId);
    await user.save();

    res.json({
      success: true,
      message: "Movie added to watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove movie from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const movieId = req.params.movieId;

    user.watchlist = user.watchlist.filter((id) => id.toString() !== movieId);
    await user.save();

    res.json({
      succes: true,
      message: "Movie removed from watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    res.status(500).json({ succes: false, message: error.message });
  }
};

// Get all movies in user's watchlist
export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "watchlist",
      "title genre releaseDate"
    );
    res.json({
      succes: true,
      watchlist: user.watchlist,
    });
  } catch (error) {
    res.status(500).json({ succes: false, message: error.message });
  }
};

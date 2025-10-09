import User from "../models/user.js";
import Rating from "../models/rating.js";
import Comment from "../models/comment.js";

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    //Basic user info
    const user = await User.findById(userId)
      .select("-password")
      .populate("watchlist", "title")
      .populate("favoriteMovies", "title");

    // The movie user has rated
    const ratedMovies = await Rating.find({ user: userId })
      .populate("movie", "title averageRating")
      .select("movie rating");

    // Comments made by the user
    const comments = await Comment.find({ user: userId })
      .populate("movie", "title")
      .select("movie text createdAt");

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        watchlist: user.watchlist,
        favoriteMovies: user.favoriteMovies,
      },
      ratedMovies,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

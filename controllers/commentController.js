import Comment from "../models/comment.js";
import Movie from "../models/movie.js";

// Create a comment
export const createComment = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).res.json({
        success: false,
        message: "Comment text is required",
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      res.status(400).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Create new comment
    const comments = await Comment.create({
      movie: movieId,
      user: req.user._id,
      text,
    });

    res.status(201).json({
      success: true,
      message: "Comment added succesfully",
      comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get comment for a specific movie
export const getCommentsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const comments = await Comment.find({ movie: movieId })
      .populate("user", "name email -_id")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Comments
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find the comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Authorization check
    // Admin can delete any comment
    // User can delete only their own comment

    if (
      req.user.role !== "admin" &&
      comment.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Delete comment
    await comment.deleteOne();

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update/edit comments
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    // Find comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check permission
    if (
      req.user.role !== "admin" &&
      comment.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this comment",
      });
    }

    // Update the comment
    comment.text = text || comment.text;
    await comment.save();

    res.json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

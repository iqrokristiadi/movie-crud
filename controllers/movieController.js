import Movie from "../models/movie.js";

// CREATE
export const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate("director").populate("actors");
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ BY ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate("director")
      .populate("actors");
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateMovie = async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
export const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

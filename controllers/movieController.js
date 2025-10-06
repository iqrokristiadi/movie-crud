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
    // read ?title=something from URL
    const { title } = req.query;
    let query = {};

    if (title) {
      // Case-insensitive regex search
      query.title = { $regex: title, $options: "i" }; //case-insensitive search
    }

    const movies = await Movie.find(query)
      .populate("director", "name -_id")
      .populate("actors", "name -_id")
      .populate("genre", "name -_id");

    res.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// READ BY ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate("director", "name -_id")
      .populate("actors", "name -_id")
      .populate("genre", "name -_id");
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET MOVIES BY DIRECTOR
export const getMovieByDirector = async (req, res) => {
  try {
    const result = await Movie.find({ director: req.params.id })
      .populate("director", "name bio -_id")
      .populate("actors", "name -_id")
      .populate("genre", "name -_id");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET MOVIES BY ACTORS
export const getMovieByActor = async (req, res) => {
  try {
    const result = await Movie.find({ actors: req.params.id })
      .populate("director", "name -_id")
      .populate("actors", "name bio -_id")
      .populate("genre", "name -_id");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET MOVIES BY GENRES
export const getMovieByGenre = async (req, res) => {
  try {
    const result = await Movie.find({ genre: req.params.id })
      .populate("director")
      .populate("actors")
      .populate("genre");
    res.json(result);
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

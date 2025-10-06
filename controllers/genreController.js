import Genre from "../models/genre.js";

// CREATE GENRE
export const createGenre = async (req, res) => {
  try {
    const genre = new Genre(req.body);
    const savedGenre = await genre.save();
    res.status(201).json(savedGenre);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ GENRE
export const getGenre = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ GENRE BY ID
export const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE GENRE
export const updateGenre = async (req, res) => {
  try {
    const updatedGenre = await Genre.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updateGenre);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE GENRE
export const deleteGenre = async (req, res) => {
  try {
    await Genre.findByIdAndDelete(req.params.id);
    res.json({ message: "Genre Deleted Successfully" });
  } catch (error) {
    res.json(500).json({ error: error.message });
  }
};

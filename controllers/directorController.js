import Director from "../models/director.js";

// Create DIRECTOR
export const createDirector = async (req, res) => {
  try {
    const director = new Director(req.body);
    const savedDirector = await director.save();
    res.status(201).json(savedDirector);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ ALL DIRECTORS
export const getDirectors = async (req, res) => {
  try {
    const directors = await Director.find();
    res.json(directors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ONE DIRECTOR BY ID
export const getDirectorById = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    res.json(director);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE DIRECTOR BY ID
export const updateDirector = async (req, res) => {
  try {
    const updatedDirector = await Director.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedDirector);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE DIRECTOR
export const deleteDirector = async (req, res) => {
  try {
    await Director.findByIdAndDelete(req.params.id);
    res.json({ message: "Director Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

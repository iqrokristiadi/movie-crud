import Actor from "../models/actor.js";

// Create Actor
export const createActor = async (req, res) => {
  try {
    const actor = new Actor(req.body);
    const savedActor = await actor.save();
    res.status(201).json(savedActor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL ACTORS
export const getActors = async (req, res) => {
  try {
    // read ?name=something from URL
    const { name } = req.query;
    let query = {};

    if (name) {
      // case-insensitive regex search
      query.name = { $regex: name, $options: "i" };
    }

    const actors = await Actor.find(query);

    res.json({ success: true, data: actors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ONE ACTOR BY ID
export const getActorById = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    res.json(actor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE ACTOR
export const updateActor = async (req, res) => {
  try {
    const updatedActor = await Actor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedActor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE ACTOR
export const deleteActor = async (req, res) => {
  try {
    await Actor.findByIdAndDelete(req.params.id);
    res.json({ message: "Actor Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import express from "express";
import dotenv from "dotenv";
import connectToDB from "./database/db.js";

// Routes imports
import movieRoutes from "./routes/movieRoutes.js";
import directorRoutes from "./routes/directorRoutes.js";
import actorRoutes from "./routes/actorRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import globalSearchRoutes from "./routes/globalSearchRoutes.js";
import filterRoutes from "./routes/filterRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());

// Database Connection
connectToDB();

// Routes
app.use("/movies", movieRoutes);
app.use("/directors", directorRoutes);
app.use("/actors", actorRoutes);
app.use("/genres", genreRoutes);
app.use("/search", globalSearchRoutes);
app.use("/filter", filterRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Movie CRUD API is Runnning");
});

// Start Server
app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port}`);
});

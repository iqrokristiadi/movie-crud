import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.log("MongoDB Connection Failed: ", error.message);
    process.exit(1);
  }
};

export default connectToDB;

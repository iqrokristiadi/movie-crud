import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User model
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowerCase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Hash password before saving (only if modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// toJSON transform — hide password and __v, keep _id or rename if you prefer
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret._v;
    // Optionally: rename _id to id
    // ret.id = ret._id;
    // delete ret._id;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;

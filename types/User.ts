import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    userType: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive",
    },
    promoSub: {
      type: Boolean,
      default: false,
    },
    favoriteMovies: {
      type: [String], // array of movie IDs
      default: [],
    },
    verificationToken: {
      type: String,
      required: function () {
        return this.status !== "active";
      },
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
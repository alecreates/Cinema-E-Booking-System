import mongoose, { Schema, models, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    author: { type: String, required: true, trim: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CastMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const MovieSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["now_showing", "coming_soon"],
      required: true,
    },
    title: { 
      type: String, 
      required: true, 
      trim: true,
    },
    description: { 
      type: String, 
      default: "", 
    },
    synopsis: { 
      type: String, 
      default: "", 
    },
    rating: { 
      type: String, 
      default: "", 
    },
    posterUrl: { 
      type: String, 
      default: "", 
    },
    trailerUrl: { 
      type: String, 
      default: "", 
    },
    duration: { 
      type: Number, 
      default: 0, 
    },
    genre: { 
      type: [String], 
      default: [], 
    },
    category: { 
      type: String, 
      default: "", 
    },
    cast: { 
      type: [CastMemberSchema], 
      default: [], 
    },
    director: { 
      type: String, 
      default: "", 
    },
    producer: { 
      type: String, 
      default: "", 
    },
    reviews: { 
      type: [ReviewSchema], 
      default: [], 
    },
  },
  { timestamps: true }
);

const Movie = models.Movie || model("Movie", MovieSchema);

export default Movie;
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMovieInteraction extends Document {
  userId: Types.ObjectId;
  movieId: Types.ObjectId;
  action: "view" | "favorite" | "purchase";
  createdAt: Date;
}

const MovieInteractionSchema = new Schema<IMovieInteraction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  action: {
    type: String,
    enum: ["favorite", "purchase"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MovieInteraction ||
  mongoose.model<IMovieInteraction>("MovieInteraction", MovieInteractionSchema);
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserPreferences extends Document {
  userId: Types.ObjectId;
  favoriteGenres: string[];
  likedMovies: Types.ObjectId[];
}

const UserPreferencesSchema = new Schema<IUserPreferences>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  favoriteGenres: [{ type: String }],
  likedMovies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
});

export default mongoose.models.UserPreferences ||
  mongoose.model<IUserPreferences>("UserPreferences", UserPreferencesSchema);
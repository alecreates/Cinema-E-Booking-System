import mongoose, { Schema, Document, Types } from "mongoose";  

// Interface for TypeScript
export interface IRecommendation extends Document {
  userId: Types.ObjectId;        // Reference to User
  recommendedMovies: Types.ObjectId[]; // Array of Movie IDs
  createdAt: Date;
}

// Mongoose Schema
const RecommendationSchema = new Schema<IRecommendation>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recommendedMovies: [{ type: Schema.Types.ObjectId, ref: "Movie", required: true }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Recommendation ||
  mongoose.model<IRecommendation>("Recommendation", RecommendationSchema);
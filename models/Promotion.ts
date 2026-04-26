import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema({
  promoCode: {
    type: String,
    required: true,
    unique: true,
  },

  type: {
    type: String,
    enum: ["percentage", "flat"],
    required: true,
  },

  value: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Promotion ||
  mongoose.model("Promotion", PromotionSchema);
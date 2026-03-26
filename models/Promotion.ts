import mongoose, {Schema,model,models} from "mongoose";

const PromotionSchema = new Schema(
    {
        promoCode:{
            type: String,
            required: true
        },
        discount:{
            type: Number,
            required: true
        }
    },
    {timestamps:true}
)
const Promotion = models.Promotion || model("Promotion",PromotionSchema);
export default Promotion
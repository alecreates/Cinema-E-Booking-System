import mongoose,{Schema,model,models} from "mongoose";

const ShowSchema = new Schema(
    {
        showRoomId:{
            type: Schema.Types.ObjectId,
            ref: 'ShowRoom',
            required: true
        },
        showTime:{
            type: Date,
            required: true
        },
        duration:{
            type: Number,
            required: true
        }
    },
    {timestamps: true}
)
const Show = models.Show || model("Show", ShowSchema);
export default Show
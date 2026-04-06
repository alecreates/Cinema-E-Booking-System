import mongoose,{Schema,model,models} from "mongoose";

const ShowSchema = new Schema(
    {
        showRoomId:{
            type: Schema.Types.ObjectId,
            ref: 'ShowRoom',
            required: true
        },
        movieId:{
            type: Schema.Types.ObjectId,
            ref: 'Movie',
            required: true

        },
        timeSlot:{
            type: String,
            enum: ['12PM', '3PM', '6PM'],
            required: true
        },
        date: {
            type: Date,
            required: true,
        }
    },
    {timestamps: true}
)
const Show = models.Show || model("Show", ShowSchema);
export default Show
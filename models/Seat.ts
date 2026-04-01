import mongoose, {Schema, model,models} from "mongoose";
import Ticket from "./Ticket";

const SeatSchema = new Schema(
    {
        showRoomId:{
            type: Schema.Types.ObjectId,
            ref: 'ShowRoom',
            required: true

        },
        row:{
            type: Number,
            required: true

        },
        number:{
            type: Number,
            required: true
        }
    },
    {timestamps: true}
)
const Seat = models.Seat || model("Seat", SeatSchema);
export default Seat
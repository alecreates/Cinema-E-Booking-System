import mongoose, {Schema, model,models} from "mongoose";

const ShowseatSchema = new Schema(
    {
        showId:{
            type:Schema.Types.ObjectId,
            ref: 'Show',
            required: true
        },
        seatId:{
            type:Schema.Types.ObjectId,
            ref: 'Seat',
            required: true
        },
        isBooked:{
            type: Boolean,
            default: false
        },
        bookingId:{
            type:Schema.Types.ObjectId,
            ref: 'Booking',
            default: null
        }
    },
    {timestamps: true}
)
const ShowSeat = models.ShowSeat || model("ShowSeat",ShowseatSchema);
export default ShowSeat
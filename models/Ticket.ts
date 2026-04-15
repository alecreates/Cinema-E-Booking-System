import mongoose, {Schema, model, models} from "mongoose";

const TicketSchema = new Schema(
    {
        bookingId:{
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: false
        },
        seatId:[{
            type: Schema.Types.ObjectId,
            ref: 'Seat',
            required: true
        }],
        showId:{
            type: Schema.Types.ObjectId,
            ref: 'Show',
            required: true
        },
        type:{
            type: String,
            enum: ['CHILD', 'ADULT', 'SENIOR'],
            required: true
        }
    },
    {timestamps: true ,collection: "Ticket"}
    

)
const Ticket = models.Ticket || model("Ticket",TicketSchema);
export default Ticket
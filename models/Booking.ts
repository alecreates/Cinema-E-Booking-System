import mongoose, {Schema, model,models} from "mongoose";

const BookingSchema = new Schema (
    {
        customerId:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true

        },
        promotionId:{
            type: Schema.Types.ObjectId,
            ref: 'Promotion',
            required: false
        },
        paymentCardId:{
            type: Schema.Types.ObjectId,
            ref: 'PaymentCard',
            
        },
        ticket:[{
            type: Schema.Types.ObjectId,
            ref: 'Ticket'
        }],
        total:{
            type: Number,
            required: true

        },
        bookingDate:{
            type: Date,
            required: true
        },


    },
    {timestamps: true}
)
const Booking = models.Booking || model("Booking", BookingSchema);
export default Booking
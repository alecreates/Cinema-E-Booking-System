import mongoose, { Schema, models, model } from "mongoose";

const PaymentCardSchema = new Schema(
    {
        customerId:{
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: true

        },

        cardNumber:{
            type: String,
            required: true
        },
        billingAddress:{
            type: String,
            required: true
        },
        expirationDate:{
            type: String,
            required: true
        }

    },
    {timestamps: true}
)

const PaymentCard = models.PaymentCard || model("PaymentCard",PaymentCardSchema);
export default PaymentCard;
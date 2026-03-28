import mongoose, { Schema, models, model } from "mongoose";

const PaymentCardSchema = new Schema(
    {
        customerId:{
            type: Schema.Types.ObjectId, 
            ref: 'Customer',
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
            type: Date,
            required: true
        }

    },
    {timestamps: true}
)

const PaymentCard = models.PaymentCard || model("PaymentCard",PaymentCardSchema);
export default PaymentCard;
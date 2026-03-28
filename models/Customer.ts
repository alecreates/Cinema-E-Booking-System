import mongoose, { Schema, models, model} from "mongoose";

const customerSchema = new Schema(
    { 

        userId:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true

        },
        status:{
            type: String,
            enum: ['ACTIVE', 'SUSPENDED','INACTIVE'],
            default:'active'
        }


    
    },
    {timestamps:true}
)
const Customer = models.Customer || model("Customer", customerSchema);
export default Customer;
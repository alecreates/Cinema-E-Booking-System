import mongoose, {Schema,model,models} from "mongoose";

const ShowRoomSchema = new Schema(
    {   
        name: { type: String, required: true },
        rows: { type: Number, default: 10 },
        seatsPerRow: { type: Number, default: 12 },
    },
    {timestamps:true}
)

const ShowRoom = models.ShowRoom || model("ShowRoom",ShowRoomSchema);
export default ShowRoom
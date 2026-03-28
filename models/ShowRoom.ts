import mongoose, {Schema,model,models} from "mongoose";

const ShowRoomSchema = new Schema(
    {},
    {timestamps:true}
)

const ShowRoom = models.ShowRoom || model("ShowRoom",ShowRoomSchema);
export default ShowRoom
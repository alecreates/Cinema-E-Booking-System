import { dbConnect } from "@/lib/mongodb";
import Show from "@/models/Show";
import ShowRoom from "@/models/ShowRoom";

export async function getShowsbyMovieId(id:string){
    await dbConnect();
    return await Show.find({movieId:id }).populate('showRoomId').sort({showTime: 1}).lean();
}

//export async function getShowbyId(id:string){
    //await dbConnect();
    //return await Show.findById(id).populate('showRoomId').lean();
//}
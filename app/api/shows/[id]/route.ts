import { NextResponse } from "next/server";
//import { dbConnect } from "@/lib/mongodb";
import { getShowsbyMovieId } from "@/services/ShowService";
import "@/models/ShowRoom"
type RouteParams = {
    params: Promise<{ id: string}>;
};

export async function GET(_request: Request, {params}: RouteParams){
    try{
    const {id} = await params;
    //await dbConnect();
    const item = await getShowsbyMovieId(id);
    return NextResponse.json(item, {status:200})
    }
    catch(error){

        console.error("GET /api/shows/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to fetch show" },
            { status: 500 }
        );


    }

}

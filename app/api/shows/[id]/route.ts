import { NextResponse } from "next/server";
//import { dbConnect } from "@/lib/mongodb";
import { getShowsbyMovieId } from "@/services/ShowService";
import "@/models/ShowRoom"
type RouteParams = {
    params: Promise<{ id: string}>;
};

/**
 * Retrieves shows for a specific movie.
 *
 * Reads the movie ID from the route parameters, calls the
 * service layer to fetch matching shows, and returns them as JSON.
 *
 * @param _request - The incoming HTTP request.
 * @param context - The route context containing params.
 * @param context.params - Promise resolving to route parameters.
 * @returns A JSON response containing matching shows or an error message.
 */
export async function GET(_request: Request, {params}: RouteParams){
    try{
    const {id} = await params;
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

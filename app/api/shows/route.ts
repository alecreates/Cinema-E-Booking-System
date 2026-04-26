import { NextRequest, NextResponse } from "next/server";
import { getAllShows, createShow } from "@/services/ShowService";

/**
 * Retrieves all shows.
 *
 * Calls the service layer to fetch every show record,
 * sorted by show time, and returns the results as JSON.
 *
 * @returns A JSON response containing all shows or an error message.
 */
export async function GET() {
    try {
        const shows = await getAllShows();

        return NextResponse.json(shows, { status: 200 });
    } catch (error) {
        console.error("GET /api/shows error:", error);

        return NextResponse.json(
            { message: "Failed to fetch shows" },
            { status: 500 }
        );
    }
}

/**
 * Creates a new show.
 *
 * Reads the request body, sends the data to the service layer,
 * and returns the newly created show as JSON.
 *
 * @param req - The incoming HTTP request containing show data.
 * @returns A JSON response containing the created show or an error message.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const newShow = await createShow(body);

        return NextResponse.json(newShow, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/shows error:", error);

        return NextResponse.json(
            { message: error.message || "Failed to create show" },
            { status: 400 }
        );
    }
}
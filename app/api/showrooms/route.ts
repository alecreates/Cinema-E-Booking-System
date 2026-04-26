// app/api/showrooms/route.ts

import { NextResponse } from "next/server";
import { getAllShowRooms } from "@/services/ShowRoomService";

/**
 * Retrieves all showrooms.
 *
 * Calls the service layer to fetch all showroom
 * records and returns them as JSON.
 *
 * @returns A JSON response containing showrooms
 * or an error message.
 */
export async function GET() {
    try {
        const showRooms =
            await getAllShowRooms();

        return NextResponse.json(
            showRooms,
            { status: 200 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Failed" },
            { status: 500 }
        );
    }
}
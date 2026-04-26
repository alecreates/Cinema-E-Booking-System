// app/api/seats/[id]/route.ts

import { NextResponse } from "next/server";
import { getSeatsByShowId } from "@/services/SeatService";

type RouteParams = {
    params: Promise<{ id: string }>;
};

/**
 * Retrieves seats and tickets for a show.
 *
 * Reads the show ID from route parameters, calls the
 * service layer, and returns seat availability data.
 *
 * @param _request - The incoming HTTP request.
 * @param context - Route context containing params.
 * @returns A JSON response containing seats and tickets
 * or an error message.
 */
export async function GET(
    _request: Request,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        const result =
            await getSeatsByShowId(id);

        return NextResponse.json(
            result,
            { status: 200 }
        );
    } catch (error: any) {
        console.error(
            "GET /api/seats/[id] error:",
            error
        );

        const status =
            error.message === "Show not found"
                ? 404
                : 500;

        return NextResponse.json(
            {
                message:
                    error.message ||
                    "Failed to fetch",
            },
            { status }
        );
    }
}
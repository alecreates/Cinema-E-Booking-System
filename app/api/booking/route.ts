// app/api/booking/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
    getAllBookings,
    createBooking,
} from "@/services/BookingService";

/**
 * Retrieves all bookings.
 *
 * Calls the service layer to fetch all bookings
 * and returns them as JSON.
 *
 * @returns A JSON response containing bookings or an error message.
 */
export async function GET() {
    try {
        const bookings = await getAllBookings();

        return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
        console.error("GET /api/booking error:", error);

        return NextResponse.json(
            { message: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}

/**
 * Creates a new booking.
 *
 * Reads request body data, sends it to the service layer,
 * and returns the created booking as JSON.
 *
 * @param request - The incoming HTTP request containing booking data.
 * @returns A JSON response containing the created booking or an error message.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const booking = await createBooking(body);

        return NextResponse.json(booking, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/booking error:", error);

        return NextResponse.json(
            { message: error.message || "Failed to create booking" },
            { status: 400 }
        );
    }
}
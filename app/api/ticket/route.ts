// app/api/ticket/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createTicket } from "@/services/TicketService";

/**
 * Creates a ticket.
 *
 * Reads request body data, calls the service layer,
 * and creates a ticket linked to a booking, seat, and show.
 *
 * @param request - The incoming HTTP request.
 * @returns A JSON response containing the created ticket
 * or an error message.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newTicket = await createTicket(body);

    return NextResponse.json(newTicket, {
      status: 201,
    });
  } catch (error: any) {
    console.error("POST /api/ticket error:", error);

    const status =
      error.message === "Missing required fields"
        ? 400
        : 500;

    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to create ticket",
      },
      { status }
    );
  }
}
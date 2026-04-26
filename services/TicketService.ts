// services/TicketService.ts

import { dbConnect } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";

/**
 * Creates a new ticket.
 *
 * Validates required fields and inserts a ticket record
 * linked to a booking, seat, and show.
 *
 * @param data - The ticket creation data.
 * @param data.bookingId - The booking identifier.
 * @param data.seatId - The seat identifier.
 * @param data.showId - The show identifier.
 * @param data.type - The ticket type (e.g., adult, child).
 * @returns A promise that resolves to the created ticket.
 * @throws Error if required fields are missing.
 */
export async function createTicket(data: {
    bookingId: string;
    seatId: string;
    showId: string;
    type: string;
}) {
    await dbConnect();

    const { bookingId, seatId, showId, type } = data;

    if (!bookingId || !seatId || !showId || !type) {
        throw new Error("Missing required fields");
    }

    return await Ticket.create({
        bookingId,
        seatId,
        showId,
        type,
    });
}
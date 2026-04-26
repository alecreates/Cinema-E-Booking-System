// services/SeatService.ts

import { dbConnect } from "@/lib/mongodb";
import Seat from "@/models/Seat";
import Ticket from "@/models/Ticket";
import Show from "@/models/Show";

/**
 * Retrieves seat and ticket data for a show.
 *
 * Finds the requested show, retrieves all seats in the
 * associated showroom, and gets booked tickets for that show.
 *
 * @param showId - The show identifier.
 * @returns A promise resolving to seat and ticket data.
 * @throws Error if the show cannot be found.
 */
export async function getSeatsByShowId(
    showId: string
) {
    await dbConnect();

    const show = await Show.findById(showId);

    if (!show) {
        throw new Error("Show not found");
    }

    const seats = await Seat.find({
        showRoomId: show.showRoomId,
    });

    const tickets = await Ticket.find({
        showId,
    });

    return {
        seats,
        tickets,
    };
}
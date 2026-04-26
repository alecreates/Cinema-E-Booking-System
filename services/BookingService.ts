// services/BookingService.ts

import { dbConnect } from "@/lib/mongodb";
import Booking from "@/models/Booking";

/**
 * Retrieves all bookings from the database.
 *
 * Results are sorted by most recent booking date first.
 *
 * @returns A promise that resolves to an array of bookings.
 */
export async function getAllBookings() {
    await dbConnect();

    return await Booking.find()
        .sort({ bookingDate: -1 })
        .lean();
}

/**
 * Creates a new booking record.
 *
 * Validates required fields and inserts the booking
 * into the database.
 *
 * @param data - The booking creation data.
 * @param data.customerId - The customer identifier.
 * @param data.promotionId - The promotion identifier.
 * @param data.paymentCardId - The payment card identifier.
 * @param data.showId - The show identifier.
 * @param data.total - The booking total amount.
 * @param data.bookingDate - The booking date.
 * @returns A promise that resolves to the created booking.
 * @throws Error if required fields are missing.
 */
export async function createBooking(data: {
    customerId: string;
    promotionId?: string;
    paymentCardId: string;
    showId: string;
    total: number;
    bookingDate: string;
}) {
    await dbConnect();

    const {
        customerId,
        promotionId,
        paymentCardId,
        showId,
        total,
        bookingDate,
    } = data;

    if (!customerId || !paymentCardId || !showId || total == null || !bookingDate) {
        throw new Error("Missing required booking fields");
    }

    return await Booking.create({
        customerId,
        promotionId,
        paymentCardId,
        showId,
        total,
        bookingDate,
    });
}
import { dbConnect } from "@/lib/mongodb";
import Show from "@/models/Show";
import mongoose from "mongoose";


/**
 * Retrieves all shows for a specific movie.
 *
 * Finds shows matching the provided movie ID, populates
 * showroom details, and sorts results by show time.
 *
 * @param id - The movie identifier.
 * @returns A promise that resolves to matching shows.
 */
export async function getShowsbyMovieId(id: string) {
    await dbConnect();
    return await Show.find({ movieId: id }).populate('showRoomId').sort({ showTime: 1 }).lean();
}

/**
 * Gets all shows from the database.
 *
 * Results are returned in ascending order by show time.
 *
 * @returns A promise that resolves to an array of shows.
 */
export async function getAllShows() {
    await dbConnect();

    return await Show.find()
        .sort({ showTime: 1 })
        .lean();
}

/**
 * Creates a new show record.
 *
 * Validates the provided data, checks for schedule conflicts,
 * and inserts the show into the database if valid.
 *
 * @param data - The show creation data.
 * @param data.showRoomId - The showroom identifier.
 * @param data.movieId - The movie identifier.
 * @param data.timeSlot - The selected time slot.
 * @param data.date - The selected show date.
 * @returns A promise that resolves to the created show.
 * @throws Error if required fields are missing, IDs are invalid,
 * or the time slot is already booked.
 */
export async function createShow(data: {
    showRoomId: string;
    movieId: string;
    timeSlot: string;
    date: string;
}) {
    await dbConnect();

    const { showRoomId, movieId, timeSlot, date } = data;

    if (!showRoomId || !movieId || !timeSlot || !date) {
        throw new Error("Missing required fields");
    }

    if (
        !mongoose.Types.ObjectId.isValid(showRoomId) ||
        !mongoose.Types.ObjectId.isValid(movieId)
    ) {
        throw new Error("Invalid movie or showroom ID");
    }

    const selectedDate = new Date(date);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingShow = await Show.findOne({
        showRoomId,
        timeSlot,
        date: {
            $gte: startOfDay,
            $lte: endOfDay,
        },
    });

    if (existingShow) {
        throw new Error(
            "This time slot is already booked for the selected room on this date."
        );
    }

    return await Show.create({
        showRoomId,
        movieId,
        timeSlot,
        date: selectedDate,
    });
}
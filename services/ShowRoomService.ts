// services/ShowRoomService.ts

import { dbConnect } from "@/lib/mongodb";
import ShowRoom from "@/models/ShowRoom";

/**
 * Retrieves all showrooms from the database.
 *
 * Returns every available showroom record.
 *
 * @returns A promise that resolves to an array of showrooms.
 */
export async function getAllShowRooms() {
    await dbConnect();

    return await ShowRoom.find({});
}
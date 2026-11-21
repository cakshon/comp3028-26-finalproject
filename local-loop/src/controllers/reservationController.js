import sql from "../models/db.js"
import { validateRequiredString, checkIDExistence, checkListingAvailability } from "../middlewares/reservationValidation.js";

// Add new reservation record
export async function createReservation(req, res) {
    const listingID = checkListingAvailability(req.body.listingID, "listingID");
    const userID = checkIDExistence(req.body.userID, "userID");
    const nAddress = validateRequiredString(req.body.address, address);

    try {
        const nRes = await sql`
        INSERT INTO Reservation (userID, listingID, rAddress, deliveryStatus, completedAt)
        VALUES (${userID}, ${listingID}, ${nAddress}, 'Reserved', NULL)
        `;
        return res.status(201).json(nRes[0]);
    } catch (e) {
        console.error('Error when creating reservation: ', e);
        return res.status(500).json({error: 'Could not create reservation'});
    }
}

// Get existing reservation record
export async function getReservation(res, req) {
    const resID = checkIDExistence(req.params.id, "reservationID")

    try {
        const result = await sql`
        SELECT reservationID, userID, listingID, rAddress, deliveryStatus, completedAt
        FROM Reservation
        WHERE reservationID = ${resID}
        `;
        if (result.length === 0) {
            return res.status(404).json({error: 'Reservation not found'});
        }
        return res.json(result[0]);
    } catch (e) {
        console.error('Error when retrieving reservation record: ', e);
        return res.status(500).json({error: 'Could not retrieve reservation'});
    }
}

// Confirm reservation by updating status to "Confirmed"
export async function confirmReservation(res, req) {
    const resID = checkIDExistence(req.params.id, "reservationID")

    try {
        const confirmed = await sql`
        UPDATE Reservation 
        SET deliveryStatus = "Confirmed" 
        WHERE reservationID = ${resID}
        `;
        return res.status(201).json(confirmed[0]);
    } catch (e) {
        console.error('Error when confirming reservation: ', e);
        return res.status(500).json({error: 'Could not confirm reservation'});
    }
}

// Close reservation by updating status to "Complete"
export async function closeReservation(res, req) {
    const resID = checkIDExistence(req.params.id, "reservationID")
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        const closed = await sql`
        UPDATE Reservation 
        SET deliveryStatus = 'Complete', completedAt = '${date}' 
        WHERE reservationID = ${resID}
        `;
        return res.status(201).json(closed[0]);
    } catch (e){
        console.error('Error when closing reservation: ', e);
        return res.status(500).json({error: 'Could not close reservation'});
    }
}
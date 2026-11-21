import express from "express";
import * as resCon from "../controllers/reservationController";

const router = express.Router();

// Create new reservation
router.post('api/listings/:listingID/reserve', resCon.createReservation);
// Get specific reservation
router.get('api/reservations/:id', resCon.getReservation);
// Confirm reservation
router.put('api/reservations/:id/confirm', resCon.confirmReservation);
// Close reservation (Mark as successful)
router.put('api/reservations/:id/close', resCon.closeReservation);

export default router;
import { Router } from 'express';
import sql from '../models/db.js';

const router = Router();

router.post('/', async (req, res) => {
    const { listingName, organisationID } = req.body ?? {};

    if (
        typeof listingName !== 'string' ||
        listingName.trim().length === 0 ||
        listingName.trim().length > 50
    ) {
        return res.status(400).json({
            message: 'Listing name must contain between 1 and 50 characters.',
        });
    }

    if (
        !Number.isInteger(organisationID) ||
        organisationID <= 0 ||
        organisationID > 2147483647
    ) {
        return res.status(400).json({
            message: 'Organisation ID must be a positive 32-bit integer.',
        });
    }

    try {
        const [listing] = await sql`
            INSERT INTO foodlisting (
                listingname,
                organisationid,
                reservationstatus
            )
            VALUES (
                ${listingName.trim()},
                ${organisationID},
                B'0'
            )
            RETURNING
                listingid AS "listingID",
                organisationid AS "organisationID",
                listingname AS "listingName",
                reservationstatus AS "reservationStatus"
        `;

        return res.status(201).json({ listing });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({
                message: 'Organisation does not exist.',
            });
        }

        console.error('Failed to create listing:', error.code);

        return res.status(500).json({
            message: 'Unable to create listing.',
        });
    }
});

export default router;
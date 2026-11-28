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

router.get('/', async (req, res) => {
    try {
        const listings = await sql`
            SELECT
                listingid AS "listingID",
                organisationid AS "organisationID",
                listingname AS "listingName",
                reservationstatus AS "reservationStatus"
            FROM foodlisting
            ORDER BY listingid DESC
        `;

        return res.status(200).json({ listings });
    } catch (error) {
        console.error('Failed to retrieve listings:', error.code);

        return res.status(500).json({
            message: 'Unable to retrieve listings.',
        });
    }
});

// Update an existing listing
router.patch('/:id', async (req, res) => {
    const listingID = Number(req.params.id);
    const { listingName } = req.body ?? {};

    // Validate listing ID
    if (
        !Number.isInteger(listingID) ||
        listingID <= 0 ||
        listingID > 2147483647
    ) {
        return res.status(400).json({
            message: 'Invalid listing ID.'
        });
    }

    // Validate listing name
    if (
        typeof listingName !== 'string' ||
        listingName.trim().length === 0 ||
        listingName.trim().length > 50
    ) {
        return res.status(400).json({
            message: 'Listing name must contain between 1 and 50 characters.'
        });
    }

    try {
        const [listing] = await sql`
            UPDATE foodlisting
            SET listingname = ${listingName.trim()}
            WHERE listingid = ${listingID}
            RETURNING
                listingid AS "listingID",
                organisationid AS "organisationID",
                listingname AS "listingName",
                reservationstatus AS "reservationStatus"
        `;

        // Check if listing exists
        if (!listing) {
            return res.status(404).json({
                message: 'Listing not found.'
            });
        }

        return res.status(200).json({ listing });

    } catch (error) {
        console.error('Failed to update listing:', error.code);

        return res.status(500).json({
            message: 'Unable to update listing.'
        });
    }
});


// Delete an existing listing
router.delete('/:id', async (req, res) => {
    const listingID = Number(req.params.id);

    // Validate listing ID
    if (
        !Number.isInteger(listingID) ||
        listingID <= 0 ||
        listingID > 2147483647
    ) {
        return res.status(400).json({
            message: 'Invalid listing ID.'
        });
    }

    try {
        const [listing] = await sql`
            DELETE FROM foodlisting
            WHERE listingid = ${listingID}
            RETURNING listingid
        `;

        // Check if listing exists
        if (!listing) {
            return res.status(404).json({
                message: 'Listing not found.'
            });
        }

        return res.status(200).json({
            message: 'Listing deleted successfully.'
        });

    } catch (error) {
        // Check for related database records
        if (error.code === '23503') {
            return res.status(409).json({
                message: 'Listing has related records and cannot be deleted.'
            });
        }

        console.error('Failed to delete listing:', error.code);

        return res.status(500).json({
            message: 'Unable to delete listing.'
        });
    }
});


export default router;
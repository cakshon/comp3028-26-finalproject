
const express = require('express');
const request = require('supertest');
const validateListing = require('../src/middlewares/validateListing');

const app = express();
app.use(express.json());

// Test-only route for the listing middleware
app.post('/api/listings', validateListing, (req, res) => {
    res.status(200).json({ message: 'Valid listing' });
});

// Generate valid listing data for testing
const validListing = () => ({
    category: 'Bakery',
    quantity: 10,
    collectionLocation: 'Surabaya',
    storageRequirements: 'Room temperature',
    allergenInformation: 'Contains wheat',
    collectionDeadline: new Date(
        Date.now() + 24 * 60 * 60 * 1000
    ).toISOString()
});

describe('Food Listing Validation', () => {

    test('accepts a valid listing', async () => {
        const response = await request(app)
            .post('/api/listings')
            .send(validListing());

        expect(response.statusCode).toBe(200);
    });

    test('rejects a negative quantity', async () => {
        const response = await request(app)
            .post('/api/listings')
            .send({ ...validListing(), quantity: -5 });

        expect(response.statusCode).toBe(400);
    });

    test('rejects a missing category', async () => {
        const response = await request(app)
            .post('/api/listings')
            .send({ ...validListing(), category: '' });

        expect(response.statusCode).toBe(400);
    });

    test('rejects an expired collection deadline', async () => {
        const response = await request(app)
            .post('/api/listings')
            .send({
                ...validListing(),
                collectionDeadline: '2020-01-01T12:00:00Z'
            });

        expect(response.statusCode).toBe(400);
    });

});

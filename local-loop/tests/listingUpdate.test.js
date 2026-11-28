
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the database
jest.unstable_mockModule('../src/models/db.js', () => ({
    default: jest.fn()
}));

const { default: sql } = await import('../src/models/db.js');
const { default: listingsRouter } = await import('../src/routes/listings.js');

const app = express();

app.use(express.json());
app.use('/api/listings', listingsRouter);

beforeEach(() => {
    sql.mockReset();
});

describe('PATCH /api/listings/:id', () => {

    // Test 1: Successfully update a listing
    test('should update a listing successfully', async () => {
        sql.mockResolvedValue([
            {
                listingID: 1,
                organisationID: 1,
                listingName: 'Updated Bread',
                reservationStatus: '0'
            }
        ]);

        const response = await request(app)
            .patch('/api/listings/1')
            .send({
                listingName: 'Updated Bread'
            });

        expect(response.status).toBe(200);
        expect(response.body.listing.listingName)
            .toBe('Updated Bread');

        expect(sql).toHaveBeenCalledWith(
            expect.any(Array),
            'Updated Bread',
            1
        );
    });

    // Test 2: Reject a missing listing name
    test('should reject a missing listing name', async () => {
        const response = await request(app)
            .patch('/api/listings/1')
            .send({});

        expect(response.status).toBe(400);
        expect(sql).not.toHaveBeenCalled();
    });

    // Test 3: Reject an empty listing name
    test('should reject an empty listing name', async () => {
        const response = await request(app)
            .patch('/api/listings/1')
            .send({
                listingName: ''
            });

        expect(response.status).toBe(400);
        expect(sql).not.toHaveBeenCalled();
    });

    // Test 4: Reject a listing name exceeding 50 characters
    test('should reject a listing name that is too long', async () => {
        const response = await request(app)
            .patch('/api/listings/1')
            .send({
                listingName: 'a'.repeat(51)
            });

        expect(response.status).toBe(400);
        expect(sql).not.toHaveBeenCalled();
    });

    // Test 5: Reject a negative listing ID
    test('should reject a negative listing ID', async () => {
        const response = await request(app)
            .patch('/api/listings/-1')
            .send({
                listingName: 'Updated Bread'
            });

        expect(response.status).toBe(400);
        expect(sql).not.toHaveBeenCalled();
    });

    // Test 6: Reject a nonnumeric listing ID
    test('should reject a nonnumeric listing ID', async () => {
        const response = await request(app)
            .patch('/api/listings/abc')
            .send({
                listingName: 'Updated Bread'
            });

        expect(response.status).toBe(400);
        expect(sql).not.toHaveBeenCalled();
    });

    // Test 7: Listing does not exist
    test('should return 404 if listing does not exist', async () => {
        sql.mockResolvedValue([]);

        const response = await request(app)
            .patch('/api/listings/999')
            .send({
                listingName: 'Updated Bread'
            });

        expect(response.status).toBe(404);
        expect(response.body.message)
            .toBe('Listing not found.');
    });

    // Test 8: Handle database errors
    test('should handle database errors', async () => {
        sql.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .patch('/api/listings/1')
            .send({
                listingName: 'Updated Bread'
            });

        expect(response.status).toBe(500);
        expect(response.body.message)
            .toBe('Unable to update listing.');
    });

});

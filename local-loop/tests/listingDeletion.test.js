
import { jest } from '@jest/globals';
import request from 'supertest';

// Mock the database
jest.unstable_mockModule('../src/models/db.js', () => ({
    default: jest.fn()
}));

const { default: sql } = await import('../src/models/db.js');
const { default: app } = await import('../src/app.js');

describe('DELETE /api/listings/:id', () => {

    beforeEach(() => {
        sql.mockReset();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Test 1: Successfully delete a listing
    test('should delete a listing successfully', async () => {
        sql.mockResolvedValue([
            { listingid: 1 }
        ]);

        const response = await request(app)
            .delete('/api/listings/1');

        expect(response.status).toBe(200);

        expect(response.body.message)
            .toBe('Listing deleted successfully.');

        expect(sql).toHaveBeenCalledWith(
            expect.any(Array),
            1
        );
    });

    // Test 2: Reject a negative listing ID
    test('should reject a negative listing ID', async () => {
        const response = await request(app)
            .delete('/api/listings/-1');

        expect(response.status).toBe(400);
        expect(sql).not.toHaveBeenCalled();
    });

    // Test 3: Reject a nonnumeric listing ID
    test('should reject a nonnumeric listing ID', async () => {
        const response = await request(app)
            .delete('/api/listings/abc');

        expect(response.status).toBe(400);
        expect(sql).not.toHaveBeenCalled();
    });

    // Test 4: Reject zero as a listing ID
    test('should reject a zero listing ID', async () => {
        const response = await request(app)
            .delete('/api/listings/0');

        expect(response.status).toBe(400);
        expect(sql).not.toHaveBeenCalled();
    });

    // Test 5: Listing does not exist
    test('should return 404 if listing does not exist', async () => {
        sql.mockResolvedValue([]);

        const response = await request(app)
            .delete('/api/listings/999');

        expect(response.status).toBe(404);

        expect(response.body.message)
            .toBe('Listing not found.');
    });

    // Test 6: Listing has related records
    test('should reject deletion when related records exist', async () => {
        sql.mockRejectedValue({
            code: '23503'
        });

        const response = await request(app)
            .delete('/api/listings/1');

        expect(response.status).toBe(409);

        expect(response.body.message)
            .toBe('Listing has related records and cannot be deleted.');
    });

    // Test 7: Handle database errors
    test('should handle database errors', async () => {
        jest.spyOn(console, 'error')
            .mockImplementation(() => {});

        sql.mockRejectedValue(
            new Error('Database error')
        );

        const response = await request(app)
            .delete('/api/listings/1');

        expect(response.status).toBe(500);

        expect(response.body.message)
            .toBe('Unable to delete listing.');
    });

});

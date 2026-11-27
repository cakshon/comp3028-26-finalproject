import { jest } from '@jest/globals';
import request from 'supertest';

const sql = jest.fn();

jest.unstable_mockModule('../src/models/db.js', () => ({
    default: sql,
}));

const { default: app } = await import('../src/app.js');

describe('Retrieve food listings', () => {
    beforeEach(() => {
        sql.mockReset();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('returns saved listings', async () => {
        const listings = [
            {
                listingID: 1,
                organisationID: 900001,
                listingName: 'Surplus bread',
                reservationStatus: '0',
            },
        ];

        sql.mockResolvedValue(listings);

        const response = await request(app).get('/api/listings');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ listings });
        expect(sql).toHaveBeenCalledTimes(1);
    });

    test('returns an empty list when there are no listings', async () => {
        sql.mockResolvedValue([]);

        const response = await request(app).get('/api/listings');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ listings: [] });
    });

    test('returns a safe response when the database fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        sql.mockRejectedValue(new Error('Internal database details'));

        const response = await request(app).get('/api/listings');

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            message: 'Unable to retrieve listings.',
        });
    });
});
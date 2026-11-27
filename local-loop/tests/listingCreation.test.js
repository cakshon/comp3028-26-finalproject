import { jest } from '@jest/globals';
import request from 'supertest';

const sql = jest.fn();

jest.unstable_mockModule('../src/models/db.js', () => ({
    default: sql,
}));

const { default: app } = await import('../src/app.js');

describe('Create food listing', () => {
    beforeEach(() => {
        sql.mockReset();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('creates a valid listing and returns HTTP 201', async () => {
        const listing = {
            listingID: 1,
            organisationID: 900001,
            listingName: 'Surplus bread',
            reservationStatus: '0',
        };

        sql.mockResolvedValue([listing]);

        const response = await request(app)
            .post('/api/listings')
            .send({
                listingName: '  Surplus bread  ',
                organisationID: 900001,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({ listing });
        expect(sql).toHaveBeenCalledTimes(1);

        // Check the values supplied to the parameterised query.
        expect(sql.mock.calls[0].slice(1)).toEqual([
            'Surplus bread',
            900001,
        ]);
    });

    test.each([
        ['blank name', {
            listingName: '   ',
            organisationID: 900001,
        }],
        ['name longer than 50 characters', {
            listingName: 'a'.repeat(51),
            organisationID: 900001,
        }],
        ['zero organisation ID', {
            listingName: 'Surplus bread',
            organisationID: 0,
        }],
        ['organisation ID supplied as text', {
            listingName: 'Surplus bread',
            organisationID: '900001',
        }],
    ])('rejects %s before querying the database', async (_, body) => {
        const response = await request(app)
            .post('/api/listings')
            .send(body);

        expect(response.statusCode).toBe(400);
        expect(sql).not.toHaveBeenCalled();
    });

    test('rejects an organisation that does not exist', async () => {
        sql.mockRejectedValue({ code: '23503' });

        const response = await request(app)
            .post('/api/listings')
            .send({
                listingName: 'Surplus bread',
                organisationID: 999999,
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Organisation does not exist.',
        });
    });

    test('returns a safe response when the database fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});

        sql.mockRejectedValue(
            new Error('Internal database connection details')
        );

        const response = await request(app)
            .post('/api/listings')
            .send({
                listingName: 'Surplus bread',
                organisationID: 900001,
            });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            message: 'Unable to create listing.',
        });
    });
});
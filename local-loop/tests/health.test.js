import request from 'supertest';
import app from '../src/app.js';

describe('LocalLoop Health Check', () => {
    test('returns status 200 when the application is working', async () => {
        const response = await request(app).get('/health');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });

    test('preserves the existing home route', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Server is running.');
    });
});

const request = require('supertest');
const app = require('../src/app');

describe('LocalLoop Health Check', () => {

    test('should return status 200 when the server is working', async () => {
        const response = await request(app).get('/health');

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('ok');
    });

});

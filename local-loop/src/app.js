import express from 'express';
import listingsRouter from './routes/listings.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/listings', listingsRouter);

app.get('/', (req, res) => {
    res.send('Server is running.');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import projectsRouter from './routes/projects.js';
import requestsRouter from './routes/requests.js';
import reviewsRouter from './routes/reviews.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded gallery images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/projects', projectsRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/reviews', reviewsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'T-Construction API' });
});

app.listen(PORT, () => {
  console.log(`T-Construction API running on port ${PORT}`);
});

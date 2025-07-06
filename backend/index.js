import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./.env') });
import express from 'express';
import pg from 'pg';
import cors from 'cors';
import shipmentsRouter from './routes/shipments.js';

// Express app setup
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
console.log('/shipments router mounted');

// ----------------------------
// Mount shipments router
app.use('/shipments', shipmentsRouter);

// ----------------------------
// Root route
app.get('/', (req, res) => {
  res.send('Express backend is running');
});

// ----------------------------
// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import shipmentsRouter from './routes/shipments.js';
import pool from './db.js';

// Load env
dotenv.config({ path: path.resolve('./.env') });
if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL not loaded from .env');
}
// Express app
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ Include DELETE
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

console.log('/shipments router mounted');
app.use('/shipments', shipmentsRouter);

app.get('/', (req, res) => {
  res.send('Express backend is running');
});

// ✅ Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ DB connection failed:', err);
  } else {
    console.log('✅ DB connected:', res.rows[0].now);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});

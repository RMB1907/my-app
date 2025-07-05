import express from 'express'
import pg from 'pg'
import dotenv from 'dotenv'
import cors from 'cors';


dotenv.config()

// PostgreSQL setup
const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

// Express app setup
const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json())

// ---------------------------------------------
// ✅ Base route
app.get('/', (req, res) => {
  res.send('🚀 Express backend is running');
});

// ---------------------------------------------
// ✅ Get all shipments
app.get('/shipments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shipments ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ---------------------------------------------
// ✅ Get shipment by ID + its events
app.get('/shipments/:id', async (req, res) => {
  const shipmentId = req.params.id;

  try {
    const shipmentResult = await pool.query(
      'SELECT * FROM shipments WHERE id = $1',
      [shipmentId]
    );

    if (shipmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const eventsResult = await pool.query(
      `SELECT location, action, event_time 
       FROM shipment_events 
       WHERE shipment_id = $1 
       ORDER BY event_time ASC`,
      [shipmentId]
    );

    const shipment = shipmentResult.rows[0];
    shipment.events = eventsResult.rows;

    res.json(shipment);
  } catch (err) {
    console.error('Error fetching shipment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------
// ✅ Add a new event to a shipment
app.post('/shipments/:id/events', async (req, res) => {
  const shipmentId = req.params.id;
  const { location, action } = req.body;

  if (!location || !action) {
    return res.status(400).json({ error: "Location and action are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO shipment_events (shipment_id, location, action)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [shipmentId, location, action]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding shipment event:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------------------------
// ✅ Start server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`)
})

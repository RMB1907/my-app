import express from 'express';
import pool from '../db.js'; // use relative path

console.log('shipments.js loaded');
console.log('DATABASE_URL from .env:', process.env.DATABASE_URL);

console.log('shipments.js loaded');
const router = express.Router();

// Create new shipment
router.post('/', async (req, res) => {
  const { product_name, origin, destination, status } = req.body;

  if (!product_name || !origin || !destination) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO shipments (product_name, origin, destination, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [product_name, origin, destination, status || 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating shipment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all shipments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shipments ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get shipment by ID + events
router.get('/:id', async (req, res) => {
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

// Add new event to shipment
router.post('/:id/events', async (req, res) => {
  const shipmentId = req.params.id;
  const { location, action } = req.body;

  if (!location || !action) {
    return res.status(400).json({ error: 'Location and action are required' });
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
    console.error('Error adding shipment event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update shipment status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE shipments SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

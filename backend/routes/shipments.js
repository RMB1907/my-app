import express from 'express';
import pool from '../db.js';
import algosdk from 'algosdk';

const router = express.Router();

// Generate blockchain address
function generateBlockchainId() {
  const account = algosdk.generateAccount();
  return {
    address: account.addr,
    privateKey: account.sk,
    mnemonic: algosdk.secretKeyToMnemonic(account.sk),
  };
}

// Create new shipment (with blockchain ID)
router.post('/', async (req, res) => {
  const { product_name, origin, destination } = req.body;

  if (!product_name || !origin || !destination) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const blockchainInfo = generateBlockchainId();

  try {
    const result = await pool.query(
      `INSERT INTO shipments (product_name, origin, destination, blockchain_id, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [product_name, origin, destination, blockchainInfo.address, 'pending']
    );

    res.status(201).json({
      shipment: result.rows[0],
      mnemonic: blockchainInfo.mnemonic // Show once or log securely
    });
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

// Update shipment
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { product_name, origin, destination, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE shipments 
       SET product_name = $1, origin = $2, destination = $3, status = $4
       WHERE id = $5
       RETURNING *`,
      [product_name, origin, destination, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating shipment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete shipment (only one copy needed)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM shipments WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json({ message: 'Shipment deleted successfully' });
  } catch (err) {
    console.error('Error deleting shipment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;

import express from 'express';
import { 
  getWalletsByAssignmentId, 
  markShipmentDeliveredByAssignmentId 
} from '../queries.js';
import { verifyPayment } from '../wallet/verifyPayment.js';
import pool from '../db.js'; // Required to query created_at

const router = express.Router();

router.post('/', async (req, res) => {
  const { assignmentId } = req.body;

  try {
    const wallets = await getWalletsByAssignmentId(assignmentId);

    if (!wallets) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Get detailed result from verifyPayment (not just a boolean)
    const result = await verifyPayment(wallets.customer_wallet, wallets.agent_wallet, 0.005);

    if (result.match) {
      // Get the created_at time of the assignment
      const createdResult = await pool.query(
        `SELECT created_at FROM shipment_assignments WHERE id = $1`,
        [assignmentId]
      );
      const createdAt = new Date(createdResult.rows[0].created_at);
      const paymentTime = new Date(result.roundTime * 1000);

      console.log('Assignment created at:', createdAt);
      console.log('Payment confirmed at:', paymentTime);

      // Check that payment is after assignment creation
      if (paymentTime < createdAt) {
        return res.status(400).json({
          success: false,
          message: 'Payment is older than assignment. Ignored.',
        });
      }

      // Pass paymentTime to update status with timestamp
      const shipmentId = await markShipmentDeliveredByAssignmentId(assignmentId, paymentTime);
      console.log(`Shipment ${shipmentId} status updated to 'delivered at ${paymentTime.toISOString()}'`);

      return res.json({
        success: true,
        message: `Payment verified. Shipment ${shipmentId} marked as delivered.`,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment not found or too small',
      });
    }
  } catch (err) {
    console.error('Verification error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

import pool from './db.js'; 

export async function getWalletsByAssignmentId(id) {
  const result = await pool.query(
    `SELECT customer_wallet_id AS customer_wallet, agent_wallet_id AS agent_wallet
     FROM shipment_assignments WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function markShipmentDeliveredByAssignmentId(assignmentId, deliveredAt) {
  const result = await pool.query(
    `SELECT blockchain_id FROM shipment_assignments WHERE id = $1`,
    [assignmentId]
  );

  if (result.rowCount === 0) {
    throw new Error('Assignment not found');
  }

  const blockchainId = result.rows[0].blockchain_id;
  const statusString = `Delivered at ${deliveredAt.toISOString()}`; // Moved before logging
  console.log('Updating status with:', statusString, blockchainId);

  const updateResult = await pool.query(
    `UPDATE shipments SET status = $1 WHERE blockchain_id = $2 RETURNING id`,
    [statusString, blockchainId]
  );

  if (updateResult.rowCount === 0) {
    throw new Error('No matching shipment found for blockchain_id');
  }

  console.log('Rows updated:', updateResult.rowCount);
  return updateResult.rows[0].id;
}

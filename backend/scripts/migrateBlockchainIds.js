// backend/scripts/migrateBlockchainIds.js

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('./.env') });
import pool from '../db.js';
import algosdk from 'algosdk';

async function migrateBlockchainIds() {
  try {
    const { rows } = await pool.query(`SELECT id, blockchain_id FROM shipments`);

    for (const row of rows) {
      try {
        const id = row.id;

        // Try to parse only if it's still a JSON blob
        if (!row.blockchain_id.startsWith('{')) {
          console.log(`Shipment ${id} already migrated, skipping.`);
          continue;
        }

        const json = JSON.parse(row.blockchain_id);
        const publicKeyObj = json.publicKey;

        const publicKeyArray = Object.values(publicKeyObj);
        const address = algosdk.encodeAddress(Uint8Array.from(publicKeyArray));

        await pool.query(
          `UPDATE shipments SET blockchain_id = $1 WHERE id = $2`,
          [address, id]
        );

        console.log(`Shipment ${id} updated to: ${address}`);
      } catch (innerErr) {
        console.error(`Error processing shipment ${row.id}:`, innerErr.message);
      }
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrateBlockchainIds();

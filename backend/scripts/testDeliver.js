import dotenv from 'dotenv';
dotenv.config();
import { markShipmentDeliveredByAssignmentId } from '../queries.js';

(async () => {
  try {
    const updatedId = await markShipmentDeliveredByAssignmentId(6, new Date());
    console.log('Shipment updated! ID:', updatedId);
  } catch (err) {
    console.error('Error occurred:', err.message);
  }
})();

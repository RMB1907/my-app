import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ShipmentTable = ({ shipments, onEdit, onDelete, onAssign }) => (
  <Table striped bordered hover responsive>
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Shipment</th>
        <th>Source</th>
        <th>Destination</th>
        <th>Timestamp</th>
        <th>Status</th>
        <th>Actions</th>
        <th>Assign</th>
      </tr>
    </thead>
    <tbody>
      {shipments.map((shipment) => (
        <tr key={shipment.id}>
          <td>{shipment.id}</td>
          <td>{shipment.product_name}</td>
          <td>{shipment.origin}</td>
          <td>{shipment.destination}</td>
          <td>{new Date(shipment.timestamp).toLocaleString()}</td>
          <td>{shipment.status}</td>
          <td>
            <Button variant="primary" size="sm" className="me-2" onClick={() => onEdit(shipment.id)}>Edit</Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(shipment.id)}>Delete</Button>
          </td>
          <td>
            <Button variant="info" size="sm" onClick={() => onAssign(shipment.id)}>Assign</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default ShipmentTable;

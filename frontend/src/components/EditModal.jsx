import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditModal = ({ show, shipment, onChange, onHide, onSave }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Shipment</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {shipment && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              value={shipment.product_name}
              onChange={(e) => onChange({ ...shipment, product_name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Origin</Form.Label>
            <Form.Control
              type="text"
              value={shipment.origin}
              onChange={(e) => onChange({ ...shipment, origin: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Destination</Form.Label>
            <Form.Control
              type="text"
              value={shipment.destination}
              onChange={(e) => onChange({ ...shipment, destination: e.target.value })}
            />
          </Form.Group>
        </Form>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Cancel</Button>
      <Button variant="primary" onClick={onSave}>Save Changes</Button>
    </Modal.Footer>
  </Modal>
);

export default EditModal;

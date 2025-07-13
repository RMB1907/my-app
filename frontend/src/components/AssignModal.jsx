import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AssignModal = ({
  show,
  shipment,
  agentWalletId,
  setAgentWalletId,
  customerWalletId,
  setCustomerWalletId,
  onHide,
  onAssign
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Assign Shipment #{shipment?.id}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Delivery Agent Wallet ID</Form.Label>
          <Form.Control
            type="text"
            value={agentWalletId}
            onChange={(e) => setAgentWalletId(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Customer Wallet ID</Form.Label>
          <Form.Control
            type="text"
            value={customerWalletId}
            onChange={(e) => setCustomerWalletId(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Cancel</Button>
      <Button variant="primary" onClick={onAssign}>Assign</Button>
    </Modal.Footer>
  </Modal>
);

export default AssignModal;

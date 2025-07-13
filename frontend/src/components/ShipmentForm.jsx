import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ShipmentForm = ({ onSubmit, productName, setProductName, origin, setOrigin, destination, setDestination }) => (
  <Form onSubmit={onSubmit} className="mb-4">
    <Row>
      <Col md={4}>
        <Form.Control
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="mb-2"
        />
      </Col>
      <Col md={4}>
        <Form.Control
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          required
          className="mb-2"
        />
      </Col>
      <Col md={4}>
        <Form.Control
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          className="mb-2"
        />
      </Col>
    </Row>
    <Button variant="success" type="submit" className="mt-2">
      Submit Shipment
    </Button>
  </Form>
);

export default ShipmentForm;

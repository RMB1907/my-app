import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Navbar,
  Form,
  Button,
  Table,
  Row,
  Col,
} from 'react-bootstrap';


const Dashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [productName, setProductName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  // Fetch shipment data
  useEffect(() => {
    axios
      .get('http://localhost:3001/shipments') // update if needed
      .then((res) => setShipments(res.data))
      .catch((err) => console.error('Error fetching shipments:', err));
  }, []);

  // Add new shipment
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/shipments', {
        product_name: productName,
        origin,
        destination,
      })
      .then((res) => {
        setShipments([res.data, ...shipments]);
        setProductName('');
        setOrigin('');
        setDestination('');
      })
      .catch((err) => console.error('Error submitting shipment:', err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/shipments/${id}`)
      .then(() => setShipments(shipments.filter((s) => s.id !== id)))
      .catch((err) => console.error('Delete error:', err));
  };

  const handleEdit = (id) => {
  const shipment = shipments.find((s) => s.id === id);
  if (shipment) {
    setEditShipment(shipment);
    setShowModal(true);
  }
};

  return (
    <Container className="mt-4">
      <Navbar bg="light" expand="lg" className="mb-4 rounded shadow-sm">
        <Container>
          <Navbar.Brand>📦 Shipment Dashboard</Navbar.Brand>
        </Container>
      </Navbar>

      <h4 className="mb-3">Add New Shipment</h4>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Group controlId="formProductName" className="mb-2">
              <Form.Control
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formOrigin" className="mb-2">
              <Form.Control
                type="text"
                placeholder="Origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formDestination" className="mb-2">
              <Form.Control
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="success" type="submit" className="mt-2">
          Submit Shipment
        </Button>
      </Form>

      <h5 className="mb-3">All Shipments</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Shipment</th>
            <th>From</th>
            <th>To</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.id}>
              <td>#{shipment.id} — {shipment.product_name}</td>
              <td>{shipment.origin}</td>
              <td>{shipment.destination}</td>
              <td>{new Date(shipment.created_at).toLocaleString()}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(shipment.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(shipment.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Dashboard;

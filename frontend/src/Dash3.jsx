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
  Modal,
} from 'react-bootstrap';

const Dashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [productName, setProductName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [editShipment, setEditShipment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch shipments on load
  useEffect(() => {
    axios
      .get('http://localhost:3001/shipments')
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
      .then(() => axios.get('http://localhost:3001/shipments'))
      .then((res) => {
        setShipments(res.data);
        setProductName('');
        setOrigin('');
        setDestination('');
      })
      .catch((err) => console.error('Error submitting shipment:', err));
  };

  // Open modal to edit
  const handleEdit = (id) => {
    const shipment = shipments.find((s) => s.id === id);
    if (shipment) {
      setEditShipment(shipment);
      setShowModal(true);
    }
  };

  // Save changes from modal
  const handleUpdate = () => {
    axios
      .put(`http://localhost:3001/shipments/${editShipment.id}`, {
        product_name: editShipment.product_name,
        origin: editShipment.origin,
        destination: editShipment.destination,
      })
      .then(() => axios.get('http://localhost:3001/shipments'))
      .then((res) => {
        setShipments(res.data);
        setShowModal(false);
      })
      .catch((err) => console.error('Error updating shipment:', err));
  };

  // Delete shipment
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/shipments/${id}`)
      .then(() => setShipments(shipments.filter((s) => s.id !== id)))
      .catch((err) => console.error('Error deleting shipment:', err));
  };

  return (
    <Container className="mt-4">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 rounded shadow">
      <Container>
        <Navbar.Brand href="#">📦 Shipment Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="ms-auto">
            <span className="text-white me-3">Welcome, Admin</span>
            <Button variant="outline-light" size="sm">Logout</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>

      {/* New Shipment Form */}
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

      {/* Shipment Table */}
      <h5 className="mb-3">All Shipments</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Shipment</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Timestamp</th>
            <th>Actions</th>
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

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Shipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editShipment && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editShipment.product_name}
                  onChange={(e) =>
                    setEditShipment({
                      ...editShipment,
                      product_name: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Origin</Form.Label>
                <Form.Control
                  type="text"
                  value={editShipment.origin}
                  onChange={(e) =>
                    setEditShipment({
                      ...editShipment,
                      origin: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Destination</Form.Label>
                <Form.Control
                  type="text"
                  value={editShipment.destination}
                  onChange={(e) =>
                    setEditShipment({
                      ...editShipment,
                      destination: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;

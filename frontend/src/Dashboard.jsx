import React, { useEffect, useState } from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import ShipmentForm from './components/ShipmentForm';
import ShipmentTable from './components/ShipmentTable';
import EditModal from './components/EditModal';
import AssignModal from './components/AssignModal';
import {
  getShipments,
  createShipment,
  updateShipment,
  deleteShipment,
  assignShipment
} from './services/shipmentService';

const Dashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [productName, setProductName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [editShipment, setEditShipment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignShipmentItem, setAssignShipmentItem] = useState(null);
  const [agentWalletId, setAgentWalletId] = useState('');
  const [customerWalletId, setCustomerWalletId] = useState('');

  const fetchShipments = () => {
    getShipments()
      .then((res) => setShipments(res.data))
      .catch((err) => console.error('Error fetching shipments:', err));
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createShipment({ product_name: productName, origin, destination })
      .then(fetchShipments)
      .then(() => {
        setProductName('');
        setOrigin('');
        setDestination('');
      });
  };

  const handleUpdate = () => {
    if (!editShipment) return;
    updateShipment(editShipment.id, editShipment)
      .then(fetchShipments)
      .then(() => {
        setEditShipment(null);
        setShowModal(false);
      });
  };

  const handleDelete = (id) => {
    deleteShipment(id).then(fetchShipments);
  };

  const handleAssign = (id) => {
    const shipment = shipments.find((s) => s.id === id);
    setAssignShipmentItem(shipment);
    setAgentWalletId('');
    setCustomerWalletId('');
    setShowAssignModal(true);
  };

  const handleAssignSave = () => {
    if (!agentWalletId || !customerWalletId) return alert('Both IDs required.');
    assignShipment(assignShipmentItem.id, {
      agent_wallet_id: agentWalletId,
      customer_wallet_id: customerWalletId,
      blockchain_id: assignShipmentItem.blockchain_id,
    })
      .then(fetchShipments)
      .then(() => {
        setShowAssignModal(false);
        setAssignShipmentItem(null);
      });
  };

  return (
    <Container className="mt-4">
      <Navbar bg="dark" variant="dark" className="mb-4 rounded shadow">
        <Container>
          <Navbar.Brand>📦 Shipment Tracker</Navbar.Brand>
          <div className="ms-auto">
            <span className="text-white me-3">Welcome, Admin</span>
            <Button variant="outline-light" size="sm">Logout</Button>
          </div>
        </Container>
      </Navbar>

      <h4>Add New Shipment</h4>
      <ShipmentForm
        onSubmit={handleSubmit}
        productName={productName}
        setProductName={setProductName}
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
      />

      <ShipmentTable
        shipments={shipments}
        onEdit={(id) => {
          const s = shipments.find((x) => x.id === id);
          setEditShipment(s);
          setShowModal(true);
        }}
        onDelete={handleDelete}
        onAssign={handleAssign}
      />

      <EditModal
        show={showModal}
        shipment={editShipment}
        onChange={setEditShipment}
        onHide={() => setShowModal(false)}
        onSave={handleUpdate}
      />

      <AssignModal
        show={showAssignModal}
        shipment={assignShipmentItem}
        agentWalletId={agentWalletId}
        setAgentWalletId={setAgentWalletId}
        customerWalletId={customerWalletId}
        setCustomerWalletId={setCustomerWalletId}
        onHide={() => setShowAssignModal(false)}
        onAssign={handleAssignSave}
      />
    </Container>
  );
};

export default Dashboard;

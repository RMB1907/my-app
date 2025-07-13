import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [formData, setFormData] = useState({
    product_name: '',
    origin: '',
    destination: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await axios.get('http://localhost:3001/shipments');
      const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setShipments(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/shipments', formData);
      setFormData({ product_name: '', origin: '', destination: '' });
      setMessage('Shipment added!');
      fetchShipments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this shipment?')) return;
    try {
      await axios.delete(`http://localhost:3001/shipments/${id}`);
      fetchShipments();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (shipment) => {
    setEditingId(shipment.id);
    setEditData({
      product_name: shipment.product_name,
      origin: shipment.origin,
      destination: shipment.destination,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:3001/shipments/${id}`, editData);
      setEditingId(null);
      fetchShipments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-700">📦 Shipment Dashboard</h1>

        {/* Add Shipment Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-blue-600">Add New Shipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="product_name"
              placeholder="Product Name"
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="origin"
              placeholder="Origin"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="destination"
              placeholder="Destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Submit Shipment
          </button>
        </form>

        {/* Shipment Table */}
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-100 text-blue-800 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">Shipment</th>
                <th className="px-6 py-4 text-left">From</th>
                <th className="px-6 py-4 text-left">To</th>
                <th className="px-6 py-4 text-left">Created</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {shipments.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50 transition">
                  {editingId === s.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          name="product_name"
                          value={editData.product_name}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          name="origin"
                          value={editData.origin}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          name="destination"
                          value={editData.destination}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded"
                        />
                      </td>
                      <td className="px-6 py-4">{new Date(s.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => saveEdit(s.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium">#{s.id} — {s.product_name}</td>
                      <td className="px-6 py-4">{s.origin}</td>
                      <td className="px-6 py-4">{s.destination}</td>
                      <td className="px-6 py-4">{new Date(s.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => startEdit(s)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

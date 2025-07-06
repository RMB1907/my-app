import { useEffect, useState } from "react";

const ShipmentDetails = ({ shipmentId }) => {
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await fetch(`http://localhost:3001/shipments/${shipmentId}`);
        const data = await res.json();
        setShipment(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load shipment");
        setLoading(false);
      }
    };
    fetchShipment();
  }, [shipmentId]);

  const updateStatus = async (id, newStatus) => {
    setUpdating(true);
    setUpdateMessage(null);
    try {
      const res = await fetch(`http://localhost:3001/shipments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

    // Re-fetch shipment by ID after update to get events too
      const refreshedRes = await fetch(`http://localhost:3001/shipments/${id}`);
      const refreshedData = await refreshedRes.json();
      setShipment(refreshedData);

      setUpdateMessage(`Status updated to "${newStatus}"`);
    } catch (err) {
      setError("Could not update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading shipment...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!shipment) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Shipment #{shipment.id}</h2>

      <div className="mb-4 space-y-1">
        <p><span className="font-semibold">Product:</span> {shipment.product_name}</p>
        <p><span className="font-semibold">From:</span> {shipment.origin}</p>
        <p><span className="font-semibold">To:</span> {shipment.destination}</p>
        <p><span className="font-semibold">Status:</span> <span className="capitalize">{shipment.status}</span></p>
        <p><span className="font-semibold">Created At:</span> {new Date(shipment.timestamp).toLocaleString()}</p>
      </div>

      <div className="flex gap-4 my-4">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          onClick={() => updateStatus(shipment.id, 'in_transit')}
          disabled={updating}
        >
          Mark In Transit
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => updateStatus(shipment.id, 'delivered')}
          disabled={updating}
        >
          Mark Delivered
        </button>
      </div>

      {updateMessage && <p className="text-green-600 mb-2">{updateMessage}</p>}
      {updating && <p className="text-gray-500">Updating status...</p>}

      <hr className="my-4" />

      <h3 className="text-xl font-semibold mb-2 text-gray-800">Shipment Timeline</h3>
      {shipment.events.length === 0 ? (
        <p className="text-gray-500">No events yet.</p>
      ) : (
        <ul className="space-y-2">
          {shipment.events.map((event, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded-lg border">
              <p><span className="font-medium">📍 {event.location}</span></p>
              <p className="text-sm text-gray-600">
                {event.action} — {new Date(event.event_time).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShipmentDetails;

import { useState } from "react";
import axios from "axios";

export default function NewShipmentForm({ onShipmentCreated }) {
  const [form, setForm] = useState({
    product_name: "",
    origin: "",
    destination: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/shipments", form);
      setMessage("Shipment added successfully.");
      onShipmentCreated(res.data.id); // pass the new ID to parent
      setForm({ product_name: "", origin: "", destination: "" });
    } catch (err) {
      console.error(err);
      setMessage("Error submitting shipment.");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        New Shipment Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product Name
          </label>
          <input
            name="product_name"
            value={form.product_name}
            onChange={handleChange}
            placeholder="e.g. Solar Panel"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Origin
          </label>
          <input
            name="origin"
            value={form.origin}
            onChange={handleChange}
            placeholder="e.g. Mumbai"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Destination
          </label>
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="e.g. Delhi"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit Shipment
        </button>

        {message && (
          <p className="text-center text-sm text-gray-600 pt-2">{message}</p>
        )}
      </form>
    </div>
  );
}

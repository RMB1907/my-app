import { useState } from "react";
import NewShipmentForm from "./components/NewShipmentForm";
import ShipmentDetails from "./components/ShipmentDetails";

function App() {
  const [latestShipmentId, setLatestShipmentId] = useState(null);

  const handleNewShipment = (id) => {
    setLatestShipmentId(id);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <NewShipmentForm onShipmentCreated={handleNewShipment} />
        {latestShipmentId && <ShipmentDetails shipmentId={latestShipmentId} />}
      </div>
    </div>
  );
}

export default App;

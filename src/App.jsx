import { useState } from "react";
import Map from "./components/Map";  // import the Map component

function App() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [time, setTime] = useState("");

  // Get your API key safely from env variables
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Start: ${start}, End: ${end}, Time: ${time}`);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Time to Kill</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Start Location</label>
          <input
            type="text"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter start location"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">End Location</label>
          <input
            type="text"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter end location"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Time Available (hours)</label>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. 3"
            min="0.5"
            step="0.5"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Plan My Route
        </button>
      </form>

      {/* Render the Google Map below the form */}
      <Map apiKey={apiKey} />
    </div>
  );
}

export default App;

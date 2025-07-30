
import { useState, useRef } from "react";
import Map from "./components/Map";
import { Autocomplete, LoadScript } from "@react-google-maps/api";



function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const startAutocompleteRef = useRef(null);
  const endAutocompleteRef = useRef(null);

  const handleStartPlaceChanged = () => {
    const place = startAutocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setStart(place.formatted_address);
      startInputRef.current.value = place.formatted_address;
    }
  };
  const handleEndPlaceChanged = () => {
    const place = endAutocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setEnd(place.formatted_address);
      endInputRef.current.value = place.formatted_address;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use the input value if no place was selected
    const startVal = startInputRef.current.value;
    const endVal = endInputRef.current.value;
    alert(`Start: ${startVal}, End: ${endVal}, Time: ${time}, Mode: ${mode}`);
  };

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
      <div className="max-w-md mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold mb-4">Time to Kill</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Start Location</label>
            <Autocomplete
              onLoad={ref => (startAutocompleteRef.current = ref)}
              onPlaceChanged={handleStartPlaceChanged}
            >
              <input
                ref={startInputRef}
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter start location"
                required
                onChange={e => setStart(e.target.value)}
              />
            </Autocomplete>
          </div>
          <div>
            <label className="block font-semibold mb-1">End Location</label>
            <Autocomplete
              onLoad={ref => (endAutocompleteRef.current = ref)}
              onPlaceChanged={handleEndPlaceChanged}
            >
              <input
                ref={endInputRef}
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter end location"
                required
                onChange={e => setEnd(e.target.value)}
              />
            </Autocomplete>
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

          <div>
            <label className="block font-semibold mb-1">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="monuments">Monuments</option>
              <option value="cafes">Cafés</option>
              <option value="parks">Parks</option>
              <option value="relax">Relax Spots</option>
              {/* add more as you want */}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Plan My Route
          </button>
        </form>

        <Map />
      </div>
    </LoadScript>
  );
}

export default App;
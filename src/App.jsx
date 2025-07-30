
import React, { useState, useRef } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import Map from "./components/Map";

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["museum", "cafe", "park", "relax"]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const startAutocompleteRef = useRef(null);
  const endAutocompleteRef = useRef(null);

  // Curated list of famous places in London
  const PLACES = [
    {
      name: "British Museum",
      category: "museum",
      photo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/British_Museum_from_NE_2.JPG",
      location: { lat: 51.5194, lng: -0.1270 },
    },
    {
      name: "Natural History Museum",
      category: "museum",
      photo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Natural_History_Museum_London_Jan_2006.jpg",
      location: { lat: 51.4967, lng: -0.1764 },
    },
    {
      name: "Hyde Park",
      category: "park",
      photo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Hyde_Park_London_-_September_2006.jpg",
      location: { lat: 51.5073, lng: -0.1657 },
    },
    {
      name: "Regent's Park",
      category: "park",
      photo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Regents_Park_London_2007-1.jpg",
      location: { lat: 51.5313, lng: -0.1569 },
    },
    {
      name: "Monmouth Coffee",
      category: "cafe",
      photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      location: { lat: 51.5136, lng: -0.0911 },
    },
    {
      name: "Kaffeine",
      category: "cafe",
      photo: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80",
      location: { lat: 51.5185, lng: -0.1411 },
    },
    {
      name: "AIRE Ancient Baths",
      category: "relax",
      photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      location: { lat: 51.5132, lng: -0.0982 },
    },
    {
      name: "Porchester Spa",
      category: "relax",
      photo: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80",
      location: { lat: 51.5192, lng: -0.1871 },
    },
  ];

  const CATEGORIES = [
    { key: "museum", label: "Museums" },
    { key: "cafe", label: "Cafés" },
    { key: "park", label: "Parks" },
    { key: "relax", label: "Relax Spots" },
  ];

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


  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const handlePlaceToggle = (place) => {
    setSelectedPlaces((prev) => {
      const exists = prev.find((p) => p.name === place.name);
      if (exists) {
        return prev.filter((p) => p.name !== place.name);
      } else {
        return [...prev, place];
      }
    });
  };

  // Filter places by selected categories
  const filteredPlaces = PLACES.filter((p) => selectedCategories.includes(p.category));
  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
      <div className="max-w-md mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold mb-4">Time to Kill</h1>
        <form className="space-y-4">
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
        </form>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {CATEGORIES.map((cat) => {
            let selectedColor = "";
            if (cat.key === "museum") selectedColor = "bg-blue-600 border-blue-600 focus:ring-blue-400";
            if (cat.key === "cafe") selectedColor = "bg-pink-600 border-pink-600 focus:ring-pink-400";
            if (cat.key === "park") selectedColor = "bg-green-600 border-green-600 focus:ring-green-400";
            if (cat.key === "relax") selectedColor = "bg-yellow-400 border-yellow-400 text-gray-900 focus:ring-yellow-300";
            const isSelected = selectedCategories.includes(cat.key);
            return (
              <button
                key={cat.key}
                type="button"
                className={`category-btn px-4 py-2 rounded-full border font-semibold transition-colors duration-150 focus:outline-none ${isSelected ? selectedColor + " text-white" : "bg-gray-200 text-gray-700 border-gray-300"}`}
                onClick={() => handleCategoryToggle(cat.key)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Place cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {filteredPlaces.map((place) => {
            const selected = selectedPlaces.some((p) => p.name === place.name);
            return (
              <div
                key={place.name}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center p-4 border-2 ${selected ? "border-green-600" : "border-transparent"}`}
              >
                <label className="flex flex-col items-center cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handlePlaceToggle(place)}
                    className="mb-2 accent-green-600 w-5 h-5"
                  />
                  <div className="w-20 h-20 rounded-full mb-2 bg-black flex items-center justify-center"></div>
                  <div className="text-center font-semibold text-sm">{place.name}</div>
                </label>
              </div>
            );
          })}
        </div>

        {/* Selected places chips */}
        {selectedPlaces.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {selectedPlaces.map((stop) => (
              <span
                key={stop.name}
                className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold"
              >
                {stop.name}
              </span>
            ))}
          </div>
        )}

        {/* Map and route will be implemented next */}
        <div className="mt-8">
          <Map
            start={start}
            end={end}
            selectedPlaces={selectedPlaces}
            onRouteInfo={setRouteInfo}
          />
        </div>
        {/* Show walking time below the map */}
        {routeInfo && routeInfo.duration && (
          <div className="mt-4 text-center text-lg font-semibold">
            Estimated walking time: {Math.round(routeInfo.duration / 60)} min
          </div>
        )}
      </div>
    </LoadScript>
  );
}

export default App;
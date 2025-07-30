
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

  // Curated list of famous places in Bucharest
  const PLACES = [
    // Museums
    {
      name: "National Museum of Art of Romania",
      category: "museum",
      photo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Muzeul_National_de_Arta_al_Romaniei_2010.jpg",
      location: { lat: 44.4397, lng: 26.0963 },
    },
    {
      name: "Grigore Antipa National Museum of Natural History",
      category: "museum",
      photo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Muzeul_National_de_Istorie_Naturala_Grigore_Antipa.jpg",
      location: { lat: 44.4602, lng: 26.0846 },
    },
    {
      name: "National Museum of Romanian History",
      category: "museum",
      photo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Muzeul_National_de_Istorie_a_Romaniei_Bucharest.jpg",
      location: { lat: 44.4325, lng: 26.0976 },
    },
    {
      name: "The Museum of the Romanian Peasant",
      category: "museum",
      photo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Muzeul_Taranului_Roman_Bucharest.jpg",
      location: { lat: 44.4542, lng: 26.0847 },
    },
    {
      name: "Cotroceni National Museum",
      category: "museum",
      photo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Muzeul_National_Cotroceni_Bucharest.jpg",
      location: { lat: 44.4352, lng: 26.0536 },
    },
    // Cafes
    {
      name: "Origo Coffee Shop",
      category: "cafe",
      photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      location: { lat: 44.4365, lng: 26.0963 },
    },
    {
      name: "M60 Cafe",
      category: "cafe",
      photo: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80",
      location: { lat: 44.4472, lng: 26.0966 },
    },
    {
      name: "Beans & Dots",
      category: "cafe",
      photo: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      location: { lat: 44.4369, lng: 26.1032 },
    },
    {
      name: "T-Zero Coffee Shop",
      category: "cafe",
      photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
      location: { lat: 44.4412, lng: 26.0977 },
    },
    {
      name: "Artichoke Social House",
      category: "cafe",
      photo: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      location: { lat: 44.4417, lng: 26.0962 },
    },
    // Relax Spots
    {
      name: "Therme București",
      category: "relax",
      photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      location: { lat: 44.6612, lng: 25.9576 },
    },
    {
      name: "Orhideea Spa",
      category: "relax",
      photo: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80",
      location: { lat: 44.4482, lng: 26.0632 },
    },
    {
      name: "Premier Palace Spa Hotel",
      category: "relax",
      photo: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      location: { lat: 44.4268, lng: 26.0174 },
    },
    {
      name: "Eden Spa",
      category: "relax",
      photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
      location: { lat: 44.4411, lng: 26.0967 },
    },
    {
      name: "Shakti Spa",
      category: "relax",
      photo: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      location: { lat: 44.4322, lng: 26.1036 },
    },
    // Parks
    {
      name: "Herastrau Park (King Michael I Park)",
      category: "park",
      photo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Parcul_Herastrau_Bucharest.jpg",
      location: { lat: 44.4762, lng: 26.0809 },
    },
    {
      name: "Cismigiu Gardens",
      category: "park",
      photo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Cismigiu_Gardens_Bucharest.jpg",
      location: { lat: 44.4362, lng: 26.0865 },
    },
    {
      name: "Tineretului Park",
      category: "park",
      photo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Parcul_Tineretului_Bucharest.jpg",
      location: { lat: 44.4065, lng: 26.1032 },
    },
    {
      name: "Carol Park",
      category: "park",
      photo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Parcul_Carol_Bucharest.jpg",
      location: { lat: 44.4167, lng: 26.0886 },
    },
    {
      name: "Alexandru Ioan Cuza Park",
      category: "park",
      photo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Parcul_Alexandru_Ioan_Cuza_Bucharest.jpg",
      location: { lat: 44.4197, lng: 26.1592 },
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
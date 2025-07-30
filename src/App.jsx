
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
      <div className="min-h-screen min-w-screen w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 py-10">
        {/* Top Bar */}
        <header className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-lg border-b border-white/30 shadow-md">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-center px-6 py-3">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow text-center">Time to Kill</span>
            {/* You can add a logo or nav here if desired */}
          </div>
        </header>
        <div className="w-full h-full mx-auto p-4 sm:p-8 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-md border border-white/40 max-w-screen-2xl xl:mx-24 lg:mx-16 md:mx-8 mt-20">
          {/* Removed duplicate 'Time to Kill' title */}
          <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">Begin your Bucharest journey</h2>
          <form className="flex flex-col sm:flex-row gap-6 mb-8 justify-center items-end">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">Start Location</label>
              <Autocomplete
                onLoad={ref => (startAutocompleteRef.current = ref)}
                onPlaceChanged={handleStartPlaceChanged}
              >
                <input
                  ref={startInputRef}
                  type="text"
                  className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 shadow focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="Enter start location"
                  required
                  onChange={e => setStart(e.target.value)}
                />
              </Autocomplete>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-gray-700">End Location</label>
              <Autocomplete
                onLoad={ref => (endAutocompleteRef.current = ref)}
                onPlaceChanged={handleEndPlaceChanged}
              >
                <input
                  ref={endInputRef}
                  type="text"
                  className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 shadow focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition"
                  placeholder="Enter end location"
                  required
                  onChange={e => setEnd(e.target.value)}
                />
              </Autocomplete>
            </div>
          </form>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-3 justify-center mt-2 mb-6">
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
        <div className="grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" style={{gridAutoFlow:'row', gridAutoColumns:'minmax(0,1fr)'}}>
          {filteredPlaces.map((place) => {
            const selected = selectedPlaces.some((p) => p.name === place.name);
            return (
              <div
                key={place.name}
                className={`relative bg-white/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex flex-col items-center p-5 border-2 ${selected ? "border-green-500 ring-2 ring-green-200" : "border-transparent"} group overflow-hidden backdrop-blur-md`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-blue-200 via-pink-200 to-yellow-100 blur-2xl z-0" />
                <label className="flex flex-col items-center cursor-pointer w-full z-10">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handlePlaceToggle(place)}
                    className="mb-2 accent-green-600 w-5 h-5"
                  />
                  <div className="w-20 h-20 rounded-full mb-2 bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg border-4 border-white">
                    <img src={place.photo} alt={place.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="text-center font-semibold text-sm text-gray-800 drop-shadow-sm">{place.name}</div>
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
        <div className="mt-10 rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white/60 backdrop-blur-xl">
          <Map
            start={start}
            end={end}
            selectedPlaces={selectedPlaces}
            onRouteInfo={setRouteInfo}
          />
        </div>
        {/* Show walking time below the map */}
        {routeInfo && routeInfo.duration && (
          <div className="mt-6 flex justify-center w-full">
            <div className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-green-200 via-blue-100 to-yellow-100 px-8 py-4 rounded-2xl shadow-lg inline-block text-center">
              <span className="mr-2">🕒</span>Estimated walking time: <span className="text-green-700">{Math.round(routeInfo.duration / 60)} min</span>
            </div>
          </div>
        )}
        </div>
      </div>
    </LoadScript>
  );
}

export default App;
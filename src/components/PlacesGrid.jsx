import { useEffect, useState } from "react";

// Props: start (string), mode (string)
const categoryMap = {
  monuments: "tourist_attraction",
  cafes: "cafe",
  parks: "park",
  relax: "spa", // example, adjust as needed
};

function PlacesGrid({ start, mode }) {
  const [places, setPlaces] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!start || !mode || !window.google) return;
    setLoading(true);
    setError("");
    // 1. Geocode the start location
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: start }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        // 2. Use PlacesService nearbySearch
        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );
        service.nearbySearch(
          {
            location,
            radius: 2000, // meters
            type: categoryMap[mode] || "tourist_attraction",
          },
          (results, status) => {
            setLoading(false);
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setPlaces(results);
            } else {
              setError("No places found.");
              setPlaces([]);
            }
          }
        );
      } else {
        setLoading(false);
        setError("Could not geocode start location.");
        setPlaces([]);
      }
    });
  }, [start, mode]);

  const handleSelect = (place) => {
    if (!selectedStops.some((p) => p.place_id === place.place_id)) {
      setSelectedStops([...selectedStops, place]);
    }
  };

  return (
    <div className="mt-8">
      {loading && <div className="text-center">Loading places...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {places.map((place) => (
          <div
            key={place.place_id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center p-4 border hover:border-blue-500"
            onClick={() => handleSelect(place)}
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
              {place.photos && place.photos.length > 0 ? (
                <img
                  src={place.photos[0].getUrl({ maxWidth: 120, maxHeight: 120 })}
                  alt={place.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400 text-3xl">🏛️</span>
              )}
            </div>
            <div className="text-center font-semibold text-sm">{place.name}</div>
          </div>
        ))}
      </div>
      {selectedStops.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Selected Stops:</h3>
          <ul className="flex flex-wrap gap-2">
            {selectedStops.map((stop) => (
              <li
                key={stop.place_id}
                className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs"
              >
                {stop.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PlacesGrid;

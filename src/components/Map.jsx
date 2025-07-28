import React, { useEffect, useRef } from "react";

const Map = ({ apiKey, center = { lat: 51.5074, lng: -0.1278 }, zoom = 12 }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      // Load script dynamically
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Initialize map after script loads
        mapRef.current = new window.google.maps.Map(
          document.getElementById("map"),
          {
            center,
            zoom,
          }
        );
      };
      document.head.appendChild(script);
    } else {
      // Script already loaded
      mapRef.current = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center,
          zoom,
        }
      );
    }
  }, [apiKey, center, zoom]);

  return (
    <div
      id="map"
      style={{ width: "100%", height: "400px", borderRadius: "8px" }}
    ></div>
  );
};

export default Map;

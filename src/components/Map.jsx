import { useEffect, useRef } from "react";

const Map = ({ apiKey }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    const google = window.google;
    // 1. Initialize map
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 51.5072, lng: -0.1276 },
      zoom: 13,
    });
  }, [apiKey]);

  return (
    <div
      ref={mapRef}
      style={{
        height: "400px",
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginTop: "2rem",
      }}
    />
  );
};

export default Map;
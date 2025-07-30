
import React, { useEffect, useRef } from "react";

const Map = ({ start, end, selectedPlaces, onRouteInfo }) => {
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const markersRef = useRef([]);

  // Helper: geocode address to LatLng
  const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
      if (!address) return resolve(null);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          resolve(null);
        }
      });
    });
  };

  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    const google = window.google;
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 44.4268, lng: 26.1025 }, // Bucharest city center
      zoom: 13,
    });

    // Remove old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Helper to add marker
    const addMarker = (pos, color = "#4285F4") => {
      if (!pos) return;
      const marker = new google.maps.Marker({
        position: pos,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "white",
        },
      });
      markersRef.current.push(marker);
    };

    // Add markers for selected places
    selectedPlaces.forEach((place) => {
      addMarker(place.location, "#34a853");
    });

    // Geocode start/end and add markers
    Promise.all([
      geocodeAddress(start),
      geocodeAddress(end),
    ]).then(([startLoc, endLoc]) => {
      if (startLoc) addMarker(startLoc, "#4285F4");
      if (endLoc) addMarker(endLoc, "#ea4335");

      // Draw route if start, end, and at least one place
      if (startLoc && endLoc && selectedPlaces.length > 0) {
        const directionsService = new google.maps.DirectionsService();
        if (!directionsRendererRef.current) {
          directionsRendererRef.current = new google.maps.DirectionsRenderer({ suppressMarkers: true });
        }
        directionsRendererRef.current.setMap(map);
        directionsService.route(
          {
            origin: startLoc,
            destination: endLoc,
            waypoints: selectedPlaces.map((p) => ({ location: p.location, stopover: true })),
            travelMode: google.maps.TravelMode.WALKING,
            optimizeWaypoints: true,
          },
          (result, status) => {
            if (status === "OK") {
              directionsRendererRef.current.setDirections(result);
              // Calculate total walking time
              let total = 0;
              const legs = result.routes[0].legs;
              for (let leg of legs) {
                total += leg.duration.value;
              }
              if (onRouteInfo) {
                onRouteInfo({ duration: total });
              }
            } else {
              directionsRendererRef.current.setDirections({ routes: [] });
              if (onRouteInfo) onRouteInfo(null);
            }
          }
        );
      } else {
        if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
        if (onRouteInfo) onRouteInfo(null);
      }
    });

    // Clean up on unmount
    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
    };
    // eslint-disable-next-line
  }, [start, end, selectedPlaces]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[60vh] min-h-[350px] md:h-[70vh] rounded-3xl border border-white/40 shadow-2xl overflow-hidden"
      style={{
        background: "#e0e7ef",
        marginTop: "2rem",
      }}
    />
  );
};

export default Map;
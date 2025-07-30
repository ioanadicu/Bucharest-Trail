
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

  // Helper to draw route and get duration
  const getRouteDuration = (startLoc, endLoc, waypoints, callback) => {
    const google = window.google;
    const directionsService = new google.maps.DirectionsService();
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    }
    directionsRendererRef.current.setMap(mapRef.current.__mapInstance || null);
    directionsService.route(
      {
        origin: startLoc,
        destination: endLoc,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.WALKING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === "OK") {
          let total = 0;
          const legs = result.routes[0].legs;
          for (let leg of legs) {
            total += leg.duration.value;
          }
          callback(total, result);
        } else {
          callback(null, null);
        }
      }
    );
  };

  // Expose a function to parent to get extra time for a place
  // Usage: getExtraTimeForPlace(place) => Promise<number|null>
  // (Parent must pass setGetExtraTimeForPlace to Map as a prop)
  useEffect(() => {
    if (!window.google) return;
    if (!start || !end) return;
    // Provide a function to parent to get extra time for a place
    if (typeof window.setGetExtraTimeForPlace === "function") {
      window.setGetExtraTimeForPlace(async (place) => {
        // Geocode start/end if needed
        const [startLoc, endLoc] = await Promise.all([
          geocodeAddress(start),
          geocodeAddress(end),
        ]);
        if (!startLoc || !endLoc) return null;
        return new Promise((resolve) => {
          const google = window.google;
          const directionsService = new google.maps.DirectionsService();
          // Route with current selectedPlaces
          directionsService.route(
            {
              origin: startLoc,
              destination: endLoc,
              waypoints: selectedPlaces.map((p) => ({ location: p.location, stopover: true })),
              travelMode: google.maps.TravelMode.WALKING,
              optimizeWaypoints: true,
            },
            (result, status) => {
              if (status !== "OK") return resolve(null);
              let base = 0;
              for (let leg of result.routes[0].legs) base += leg.duration.value;
              // Route with this place added
              directionsService.route(
                {
                  origin: startLoc,
                  destination: endLoc,
                  waypoints: [...selectedPlaces, place].map((p) => ({ location: p.location, stopover: true })),
                  travelMode: google.maps.TravelMode.WALKING,
                  optimizeWaypoints: true,
                },
                (result2, status2) => {
                  if (status2 !== "OK") return resolve(null);
                  let withPlace = 0;
                  for (let leg of result2.routes[0].legs) withPlace += leg.duration.value;
                  resolve(withPlace - base);
                }
              );
            }
          );
        });
      });
    }
  }, [start, end, selectedPlaces]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    const google = window.google;
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 44.4268, lng: 26.1025 }, // Bucharest city center
      zoom: 13,
    });
    mapRef.current.__mapInstance = map;

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

      // Draw route if start and end are set (even if no places)
      if (startLoc && endLoc) {
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
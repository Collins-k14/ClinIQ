import React from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
};

export default function MapView({ facilities = [], onSelectFacility }) {
  const [selected, setSelected] = React.useState(null);

  // Load Google Maps
 const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
});

  // Default map center
  const defaultCenter = { lat: -1.286389, lng: 36.817223 }; // Nairobi

  if (!isLoaded) return <p className="text-center text-gray-500">Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={12}
      options={{
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
      }}
    >
      {facilities.map((facility) => (
        <Marker
          key={facility._id || facility.name}
          position={{
            lat: facility.location?.lat || defaultCenter.lat,
            lng: facility.location?.lng || defaultCenter.lng,
          }}
          icon={{
            url: facility.isPremium
              ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
              : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
          onClick={() => setSelected(facility)}
        />
      ))}

      {selected && (
        <InfoWindow
          position={{
            lat: selected.location.lat,
            lng: selected.location.lng,
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="p-2">
            <h3 className="font-semibold">{selected.name}</h3>
            <p className="text-sm text-gray-600">{selected.type}</p>
            <button
              onClick={() => onSelectFacility(selected)}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              View Details
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

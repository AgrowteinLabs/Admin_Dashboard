import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "./AreaCharts.scss";

const UserLocationsMap = () => {
  const userLocations = [
    { id: 1, name: "John Doe", position: [51.505, -0.09] },
    { id: 2, name: "Jane Smith", position: [51.51, -0.1] },
    { id: 3, name: "Alice Johnson", position: [51.49, -0.08] },
  ];

  return (
    <div className="card">
      <h4 className="card-title">
        User Locations
      </h4>
      <div className="card-content map-wrapper">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocations.map((location) => (
            <Marker key={location.id} position={location.position}>
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default UserLocationsMap;

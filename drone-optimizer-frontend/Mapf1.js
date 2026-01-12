import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

elete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DroneMap() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ lat: '', lng: '', name: '' });

  useEffect(() => {
    fetch('http://localhost:3000/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error('Error fetching locations:', err));
  }, []);


  const handleAddLocation = () => {
    const { lat, lng, name } = newLocation;
    if (!lat || !lng || !name) {
      alert('Please enter all fields');
      return;
    }

    fetch('http://localhost:3000/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        name: name
      }),
    })
      .then(res => res.json())
      .then(() => {
        setLocations([...locations, {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          name: name
        }]);
        setNewLocation({ lat: '', lng: '', name: '' });
      })
      .catch(err => console.error('Error adding location:', err));
  };

  return (
    <div>
      <div style={{ padding: '10px', background: '#f0f0f0' }}>
        <h3>Add New Location</h3>
        <input
          type="text"
          placeholder="Name"
          value={newLocation.name}
          onChange={e => setNewLocation({ ...newLocation, name: e.target.value })}
        />
        <input
          type="number"
          step="0.000001"
          placeholder="Latitude"
          value={newLocation.lat}
          onChange={e => setNewLocation({ ...newLocation, lat: e.target.value })}
        />
        <input
          type="number"
          step="0.000001"
          placeholder="Longitude"
          value={newLocation.lng}
          onChange={e => setNewLocation({ ...newLocation, lng: e.target.value })}
        />
        <button onClick={handleAddLocation}>Add</button>
      </div>

      <MapContainer
        center={[43.65, -79.38]}
        zoom={13}
        style={{ height: '90vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc, index) => (
            <Marker
                key={index}
                position={[loc.lat, loc.lng]}
                icon={L.divIcon({
                className: 'custom-emoji-marker',
                html: `<div style="font-size: 24px;">🚁</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                })}
            >
                <Popup>{loc.name}</Popup>
            </Marker>
        ))}

      </MapContainer>
    </div>
  );
}


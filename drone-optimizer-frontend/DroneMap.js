import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DroneMap() {
    
    // Locations state
  console.log('Rendering DroneMap component...');
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ lat: '', lng: '', name: '' });

  // Obstacles state
  const [obstacles, setObstacles] = useState([]);
  const [newObstacle, setNewObstacle] = useState({ lat: '', lng: '', name: '' });

  // Fetch locations once on mount
  useEffect(() => {
    fetch('http://localhost:3000/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error('Error fetching locations:', err));
  }, []);

  // Fetch obstacles once on mount
  useEffect(() => {
    fetch('http://localhost:3000/api/obstacles')
      .then(res => res.json())
      .then(data => setObstacles(data))
      .catch(err => console.error('Error fetching obstacles:', err));
  }, []);

  // Add new location handler
  const handleAddLocation = () => {
    const { lat, lng, name } = newLocation;
    if (!lat || !lng || !name) {
      alert('Please enter all location fields');
      return;
    }
    fetch('http://localhost:3000/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        name,
      }),
    })
      .then(res => res.json())
      .then(() => {
        setLocations(prev => [...prev, { lat: parseFloat(lat), lng: parseFloat(lng), name }]);
        setNewLocation({ lat: '', lng: '', name: '' });
      })
      .catch(err => console.error('Error adding location:', err));
  };

  // Add new obstacle handler
  const handleAddObstacle = () => {
    const { lat, lng, name } = newObstacle;
    if (!lat || !lng || !name) {
      alert('Please enter all obstacle fields');
      return;
    }
    fetch('http://localhost:3000/api/obstacles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        name,
      }),
    })
      .then(res => res.json())
      .then(() => {
        setObstacles(prev => [...prev, { lat: parseFloat(lat), lng: parseFloat(lng), name }]);
        setNewObstacle({ lat: '', lng: '', name: '' });
      })
      .catch(err => console.error('Error adding obstacle:', err));
  };

  return (
    <div style={{ padding: '10px' }}>
      {/* Location form */}
      <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
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
        <button onClick={handleAddLocation}>Add Location</button>
      </div>

      {/* Obstacle form */}
      <div style={{ padding: '10px', background: '#f9d6d5', marginBottom: '20px' }}>
        <h3>Add New Obstacle</h3>
        <input
          type="text"
          placeholder="Name"
          value={newObstacle.name}
          onChange={e => setNewObstacle({ ...newObstacle, name: e.target.value })}
        />
        <input
          type="number"
          step="0.000001"
          placeholder="Latitude"
          value={newObstacle.lat}
          onChange={e => setNewObstacle({ ...newObstacle, lat: e.target.value })}
        />
        <input
          type="number"
          step="0.000001"
          placeholder="Longitude"
          value={newObstacle.lng}
          onChange={e => setNewObstacle({ ...newObstacle, lng: e.target.value })}
        />
        <button onClick={handleAddObstacle}>Add Obstacle</button>
      </div>

      {/* Map */}
      <MapContainer
        center={[43.65, -79.38]}
        zoom={13}
        style={{ height: '80vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Location markers */}
        {locations.map((loc, i) => (
          <Marker
            key={`loc-${i}`}
            position={[loc.lat, loc.lng]}
            icon={L.divIcon({
              className: 'custom-emoji-marker',
              html: `<div style="font-size: 24px;">🚁</div>`, // helicopter emoji for locations
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}

        {/* Obstacle markers */}
        {obstacles.map((obs, i) => (
          <Marker
            key={`obs-${i}`}
            position={[obs.lat, obs.lng]}
            icon={L.divIcon({
              className: 'custom-emoji-marker',
              html: `<div style="font-size: 24px;">🚧</div>`, // construction emoji for obstacles
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>{obs.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

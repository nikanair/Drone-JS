const express = require('express');
const router = express.Router();

// Haversine formula to calculate distance between two lat/lng points
function getDistance(a, b) {
  const R = 6371; // km
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const aVal = sinDLat * sinDLat +
               sinDLng * sinDLng * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
}

// POST /api/optimize
router.post('/', (req, res) => {
  const { locations } = req.body;

  if (!locations || !Array.isArray(locations) || locations.length < 2) {
    return res.status(400).json({ error: 'At least two locations required for optimization' });
  }

  let unvisited = [...locations];
  let route = [];
  let current = unvisited.shift();
  route.push(current);

  while (unvisited.length) {
    let nearestIndex = 0;
    let nearestDistance = getDistance(current, unvisited[0]);

    unvisited.forEach((loc, index) => {
      const dist = getDistance(current, loc);
      if (dist < nearestDistance) {
        nearestDistance = dist;
        nearestIndex = index;
      }
    });

    current = unvisited.splice(nearestIndex, 1)[0];
    route.push(current);
  }

  res.json({ optimizedRoute: route });
});

module.exports = router;

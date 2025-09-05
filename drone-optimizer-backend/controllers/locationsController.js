const fs = require('fs');
const path = './data/locations.json';

exports.addLocation = (req, res) => {
  const locations = JSON.parse(fs.readFileSync(path));
  locations.push(req.body);
  fs.writeFileSync(path, JSON.stringify(locations, null, 2));
  res.json({ message: 'Location added successfully' });
};

exports.getLocations = (req, res) => {
  const locations = JSON.parse(fs.readFileSync(path));
  res.json(locations);
};

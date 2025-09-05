const fs = require('fs');
const path = './data/obstacles.json';

exports.addObstacle = (req, res) => {
  const obstacles = JSON.parse(fs.readFileSync(path));
  obstacles.push(req.body);
  fs.writeFileSync(path, JSON.stringify(obstacles, null, 2));
  res.json({ message: 'Obstacle added successfully' });
};

exports.getObstacles = (req, res) => {
  const obstacles = JSON.parse(fs.readFileSync(path));
  res.json(obstacles);
};

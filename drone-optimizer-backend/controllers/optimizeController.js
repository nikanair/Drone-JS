exports.optimizeRoute = (req, res) => {
  const { locations, obstacles } = req.body;

  const optimizedRoute = {
    waypoints: locations || [],
    score: 100 
  };

  res.json(optimizedRoute);
};


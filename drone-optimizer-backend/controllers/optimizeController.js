// For now, return a mocked optimized route
exports.optimizeRoute = (req, res) => {
  const { locations, obstacles } = req.body;

  // Simple mock logic: return the locations as waypoints
  const optimizedRoute = {
    waypoints: locations || [],
    score: 100 // pretend perfect score for MVP
  };

  res.json(optimizedRoute);
};

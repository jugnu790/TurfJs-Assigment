const express = require('express');
const app = express();
const turf = require('@turf/turf');

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware for authentication
app.use((req, res, next) => {
  const authHeader = req.header('Authorization');

  // Perform authentication logic here
  const validToken = 'your_valid_token'; // Replace with your actual valid token
  const authenticated = authHeader && authHeader === validToken;

  // If authentication fails, send a 401 Unauthorized response
  if (!authenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
});

// Endpoint for finding line intersections
app.post('/intersections', (req, res) => {
  // Check if the request body is missing or malformed
  if (!req.body || !req.body.lineString) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    // Extract the linestring coordinates from the request body
    const coordinates = req.body.lineString.coordinates;

    // Convert the coordinates to a Turf.js LineString object
    const linestring = turf.lineString(coordinates);

    // Array to store intersections
    const intersections = [];

    // Iterate over each line in the provided set
    for (const line of lines) {
      // Convert the line coordinates to a Turf.js LineString object
      const lineCoords = line.line.coordinates;
      const lineString = turf.lineString(lineCoords);

      // Check for intersection between linestring and line
      if (turf.booleanIntersects(linestring, lineString)) {
        intersections.push({
          lineId: line.lineId,
          intersectionPoint: turf.lineIntersect(linestring, lineString).features[0].geometry.coordinates
        });
      }
    }

    // Return the intersections as a response
    res.json(intersections);
  } catch (error) {
    // Log and handle any errors that occurred during processing
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

const express = require('express');
const app = express();
const PORT = 3000;

// Import your new routes
const apiRoutes = require('../routes/apiRoutes');

app.use(express.json()); // Middleware to parse JSON bodies

// --- Use the routes ---
// Any request to '/api/...' will be handled by the router you created.
// For example, a request to '/api/profile' will hit the '/profile' route in apiRoutes.js
app.use('/api', apiRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
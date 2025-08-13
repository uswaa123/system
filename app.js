// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 21859;

// // Middleware to parse JSON and enable CORS
// app.use(express.json());
// app.use(cors({
//     origin: '*',
//     credentials: false,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));

// // Add logging middleware
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path} - Body:`, req.body);
//     next();
// });

// // Import database connection (to ensure it's established on startup)
// const db = require('./config/db.config');

// // Import routes
// const authRoutes = require('./routes/auth.routes');

// // Use routes
// app.use('/api/auth', authRoutes);

// // Simple test route
// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// // app.listen(3000, '0.0.0.0', () => {
// //     console.log("Server running on http://192.168.100.153:3000");
// //   })

// // app.listen(3000, "0.0.0.0", () => console.log("Server running on all network interfaces"));


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 21859;
// Middleware
app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Logging middleware
app.use((req, res, next) => {
    console.log(`:envelope_with_arrow: ${req.method} ${req.path}`, req.body);
    next();
});
// Connect DB
require('./config/db.config');
// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
// Test route
app.get('/', (req, res) => {
    res.send(':white_check_mark: API is running...');
});
// Start server
app.listen(port, () => {
    console.log(`:rocket: Server is running on port ${port}`);
});







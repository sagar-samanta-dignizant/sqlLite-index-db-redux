import express from 'express';
import cors from 'cors';
import users from './data/users.js';
import spaces from './data/spaces.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'API Server is running',
        endpoints: {
            users: '/api/users',
            spaces: '/api/spaces'
        }
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    // Simulate network delay
    setTimeout(() => {
        res.json({
            success: true,
            data: users,
            count: users.length,
            timestamp: new Date().toISOString()
        });
    }, 500);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json({
            success: true,
            data: user
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
});

// Get all spaces
app.get('/api/spaces', (req, res) => {
    // Simulate network delay
    setTimeout(() => {
        res.json({
            success: true,
            data: spaces,
            count: spaces.length,
            timestamp: new Date().toISOString()
        });
    }, 500);
});

// Get space by ID
app.get('/api/spaces/:id', (req, res) => {
    const space = spaces.find(s => s.id === parseInt(req.params.id));
    if (space) {
        res.json({
            success: true,
            data: space
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'Space not found'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📊 Users endpoint: http://localhost:${PORT}/api/users`);
    console.log(`📁 Spaces endpoint: http://localhost:${PORT}/api/spaces`);
});

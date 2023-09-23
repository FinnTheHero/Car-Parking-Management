import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// User and Admin models
// import { User, Admin } from './models';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

// User registration, authorization, password recovery
app.post('/register', (req, res) => {
    // Implement registration logic here
});

app.post('/login', (req, res) => {
	res.send("Login");
});

app.post('/recover-password', (req, res) => {
    // Implement password recovery logic here
});

// User vehicle management
app.post('/vehicle', (req, res) => {
    // Implement vehicle addition logic here
});

app.put('/vehicle/:id', (req, res) => {
    // Implement vehicle update logic here
});

app.delete('/vehicle/:id', (req, res) => {
    // Implement vehicle deletion logic here
});

// Admin parking zone management
app.post('/parking-zone', (req, res) => {
    // Implement parking zone creation logic here
});

app.put('/parking-zone/:id', (req, res) => {
    // Implement parking zone update logic here
});

app.delete('/parking-zone/:id', (req, res) => {
    // Implement parking zone deletion logic here
});

// Parking reservation
app.post('/reserve', (req, res) => {
    // Implement parking reservation logic here
});

// Start the server with nodemon
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
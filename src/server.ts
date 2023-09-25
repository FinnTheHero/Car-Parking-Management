import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// User and Admin models
import { User } from './models/user.model';
import { Car } from './models/car.model';


const app = express();
app.use(morgan('dev')); 
app.use(bodyParser.json());

// User registration, authorization, password recovery
app.post('/register', async (req, res) => {
    // Implement registration logic here
    const { First_name, Last_name, Email, Password, IsAdmin } = req.body;
    try {
        const [ user, created ] = await User.findOrCreate({
            where: {
                email: `${Email}`
            },
            defaults: {
                first_name: `${First_name}`,
                last_name: `${Last_name}`,
                email: `${Email}`,
                password: `${Password}`,
                isAdmin: `${IsAdmin}`
            }
        });

        if (created) {
            res.status(200).send(`User ${First_name} created successfully!`);
        } else {
            res.send("User with this email exists! Try logging in!");
        }

    } catch (err) {
        console.error(err);
        res.status(401).send("Internal Server Error!");
    }
});

app.post('/login', async (req, res) => {
    // Implement login logic here
    const { Email, Password } = req.body;
    try{
        const user = await User.findOne({ where: { email: `${Email}`, password: `${Password}`}});
        if (!user) {
            res.status(401).send("Credentials are wrong !");
        } else {
            res.status(200).send(`Logged in as ${user.first_name} successfully !`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error!");
    }
    
});

app.post('/recover-password', async (req, res) => {
    // Implement password recovery logic here
    const { Email } = req.body;
    try {
        const user = await User.findOne({ where: { email: `${Email}` }});
        if (!user) {
            res.status(401).send("User Doesnt Exist!");
        } else {
            res.send(`password: ${user.password}`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error!");
    }
});

// User vehicle management
app.post('/vehicle', async (req, res) => {
    // Implement vehicle addition logic here
    const { User_id, Name, State_number, Type } = req.body;
    try {
        const user = await User.findOne({ where: { id: User_id } });
        if (user) {
            const car = await Car.create({
                user_id: User_id,
                name: Name,
                state_number: State_number,
                type: Type
            });
    
            res.status(200).send(`Car added to user with id: ${User_id}`);
        } else {
            res.status(404).send(`User with id ${User_id} doesn't exists! Assign car to a valid user!`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error!");
    }
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
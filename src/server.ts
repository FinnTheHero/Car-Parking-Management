import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// User and Admin models
import { User } from './models/user.model';
import { Car } from './models/car.model';
import { ParkingZone } from './models/parkingZone.model';

// Import Hash function
import { hash } from './hash';

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
                password: `${hash(Password)}`,
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
        const user = await User.findOne({ where: { email: `${Email}`, password: `${hash(Password)}`}});
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

app.put('/vehicle/:id', async (req, res) => {
    // Implement vehicle update logic here
    const { Email, Password, Updated_name, Updated_state_number, Updated_type } = req.body;
    try {
        // Find the user by email and password
        const user = await User.findOne({ where: { email: `${Email}`, password: `${hash(Password)}`}});
        if (!user) {
            // User doesnt exist
            return res.status(404).send(`User with mail ${Email} not found!`);
        }
        
        // Find the car by id
        const car = await Car.findOne({ where: { id: req.params.id } });
        if (!car) {
            // Car doesnt exist
            return res.status(404).send(`Vehicle with ID ${req.params.id} not found!`);
        }

        // If the user is admin modify car without further checking for permission
        if (user.isAdmin) {
			if (typeof Updated_name !== 'undefined')   car.name = Updated_name;
			if (typeof Updated_state_number !== 'undefined')   car.state_number = Updated_state_number;
			if (typeof Updated_type !== 'undefined')   car.type = Updated_type;

			await car.save();

			return res.status(200).send("Vehicle updated successfully");
        }
        
        // If the user is not admin check if the user owns the car
		if (car.user_id === user.id) {
			// User owns car modification is allowed
			if (Updated_name)   car.name = Updated_name;
			if (Updated_state_number)   car.state_number = Updated_state_number;
			if (Updated_type)   car.type = Updated_type;

			await car.save();

			return res.status(200).send("Vehicle updated successfully");
		}
        // If user doesnt own car, deny access
		return res.status(404).send(`You dont have acccess to vehicle with ID ${req.params.id}!`); 
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error!");
    }
});

app.delete('/vehicle/:id', async (req, res) => {
    // Implement vehicle deletion logic here
    const { Email, Password } = req.body;
    try {
        // Find the user by email and password
        const user = await User.findOne({ where: { email: `${Email}`, password: `${hash(Password)}`}});
        if (!user) {
            // User doesnt exist
            return res.status(404).send(`User with mail ${Email} not found!`);
        }
        
		// Find the car by id
		const car = await Car.findOne({ where: { id: req.params.id } });
		if (!car) {
			// Car doesnt exist
			return res.status(404).send(`Vehicle with ID ${req.params.id} not found!`);
		}
		
		// If the user is admin delete car without further checking for permission
        if (user.isAdmin) {
            const deletedCar = await Car.destroy({ where: { id: req.params.id } });

            if (deletedCar === 0) {
                // Car doesnt exist
                return res.status(404).send(`Vehicle with ID ${req.params.id} not found!`);
            }

            return res.status(200).send("Vehicle deleted successfully!");
        }

        // If the user is not admin check if the user owns the car
        if (car.user_id === user.id) {
            // User owns the car, deletion is allowed
            await car.destroy();
            return res.status(200).send("Vehicle deleted successfully!");
        }

        // If user doesnt own car, deny access
        return res.status(404).send(`You dont have acccess to vehicle with ID ${req.params.id}!`);
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error!");
    }
});

// Admin parking zone management
app.post('/parking-zone', async (req, res) => {
    // Implement parking zone creation logic here
	const { Email, Password, Name, Address, Price  } = req.body;
	try {
		// Find the user by email and password
        const user = await User.findOne({ where: { email: `${Email}`, password: `${hash(Password)}`}});
        if (!user) {
            // User doesnt exist
            return res.status(404).send(`User with mail ${Email} not found!`);
        }

		// Check if the user is admin
		if (!user.isAdmin) {
			// User is not allowed
			return res.status(404).send(`You dont have acccess to create parking-zones!`);
		}

		// See if parking zone exists, if not create
		const [ parkinZone, created ] = await ParkingZone.findOrCreate({
			where: {
				name: `${Name}`,
				address: `${Address}`
			},
			defaults: {
				name: `${Name}`,
				address: `${Address}`,
				price: `${Price}`
			
			}
		});

		if (created) {
			return res.status(200).send("Parking zone created successfuly!");
		} else {
			return res.send(`Parking Zone '${Name}' on address '${Address}' already exists!`);
		}

	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error!");
	}
});

app.put('/parking-zone/:id', async (req, res) => {
    // Implement parking zone update logic here
	const { Email, Password, Updated_name, Updated_address, Updated_price } = req.body;
	try {
		// Find the user by email and password
		const user = await User.findOne({ where: { email: `${Email}`, password: `${hash(Password)}` } });
		if(!user) {
			// User doesn't exist
			return res.status(404).send(`User with mail ${Email} not found!`);
		}
		
		// Check if the user is admin
		if (!user.isAdmin) {
			// User is not allowed
			return res.status(404).send(`You dont have acccess to create parking-zones!`);
		}

		// Find parking zone by id
		const parkingZone = await ParkingZone.findOne({ where: { id: req.params.id } });
		if (!parkingZone) {
			// Parking zone doesn't exist
			return res.status(404).send(`Parking zone with ID ${req.params.id} not found!`);
		}

		// Check if user wants to set name and address same as other parking zone(not allowed)
		let addr, n;
		if (typeof Updated_address === 'undefined') {
			addr = parkingZone.address;
		} else {
			addr = Updated_address;
		}
		if (typeof Updated_name === 'undefined') {
			n = parkingZone.name;
		} else {
			n = Updated_name;
		}

		const updatedParkingZone = await ParkingZone.findOne({ where: { name: `${n}`, address: `${addr}` } });
		if (!updatedParkingZone) {
			// Modify parking zone
			if (typeof Updated_name !== 'undefined') parkingZone.name = Updated_name;
			if (typeof Updated_address !== 'undefined') parkingZone.address = Updated_address;
			if (typeof Updated_price !== 'undefined') parkingZone.price = Updated_price;

		
			// Save changes
			await parkingZone.save();
			
			return res.status(200).send("Parking zone updated successfully!");
		} else {
			return res.send(`Parking zone '${n}' on address '${addr}' already exists!`);
		}

	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error!");
	}
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
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const database = process.env.PGDATABASE;
const username = process.env.PGUSER;
const password = process.env.PGPASSWORD;

if (!database || !username || !password) {
    throw new Error('Database configuration variables are not set!');
}

export const connection = new Sequelize(database, username, password, {
    dialect: 'postgres',
    host: 'localhost',  
    port: 5432,
});
    
connection.authenticate()
    .then(() => {
        console.log("Connection has established");
    })
    .catch(err => {
        console.log("Unable to connect to the database \nError: ", err);
    });

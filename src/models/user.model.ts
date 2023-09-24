import { Model, DataTypes } from 'sequelize';
import { connection } from '../database';

export class User extends Model {
	public id!: number;
	public first_name!: string;
	public last_name!: string;
	public email!: string;
	public password!: string;
	public isAdmin!: boolean;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		first_name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		last_name: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		email: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	},
	{
		sequelize: connection,
		timestamps: false,
		tableName: 'Users',
	}
);

import { Model, DataTypes } from 'sequelize';
import { connection } from '../database';

export class ParkingZone extends Model {
    public id!: number;
    public name!: string;
    public address!: string;
    public price!: number;
}

ParkingZone.init(
    {   
        id: {
			type: DataTypes.INTEGER,
			allowNull: false,
            primaryKey: true,
			autoIncrement: true,
		},
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.NUMBER,
            allowNull: false,
        }
    },
    {
        sequelize: connection,
        timestamps: false,
        tableName: 'ParkingZones',
    }
);

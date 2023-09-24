import { Model, DataTypes } from 'sequelize';
import { connection } from '../database';

export class Cars extends Model {
    public user_id!: number;
    public name!: string;
    public state_number!: string;
    public type!: string;
}

Cars.init(
    {   
        id: {
			type: DataTypes.INTEGER,
			allowNull: false,
            primaryKey: true,
			autoIncrement: true,
		},
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        state_number: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    {
        sequelize: connection,
        timestamps: false,
        tableName: 'Cars',
    }
);

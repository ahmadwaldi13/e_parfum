import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import User from './User.js'

export const Address = db.define('address', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subdistrict: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postal_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    detail_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    freezeTableName: true,
})

User.hasMany(Address, { foreignKey: 'user_id'})
Address.belongsTo(User, { foreignKey: 'user_id' })

export default Address 
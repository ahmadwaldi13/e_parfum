import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Shipping_method = db.define('Shipping_method', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: false
})

export default Shipping_method
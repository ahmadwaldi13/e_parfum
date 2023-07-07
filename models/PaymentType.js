import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Payment_type = db.define('Payment_type', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableNames: false,
    timestamps: false,
})

export default Payment_type
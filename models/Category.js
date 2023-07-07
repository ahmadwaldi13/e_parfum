import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Category = db.define('category', {
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
})

export default Category
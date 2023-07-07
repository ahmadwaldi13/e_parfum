import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Product_variation = db.define('product_variation', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

export default Product_variation
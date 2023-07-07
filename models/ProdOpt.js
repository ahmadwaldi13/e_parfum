import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import Product_variation from './ProdVar.js'

const Product_variation_option = db.define('product_variation_option', {
    product_variation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product_variation,
            key: 'id'
        }
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
})

Product_variation.hasMany(Product_variation_option, { foreignKey: 'product_variation_id' })
Product_variation_option.belongsTo(Product_variation, { foreignKey: 'product_variation_id' })

export default Product_variation_option
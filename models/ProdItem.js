import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import Product from './Product.js'

const Product_item = db.define('product_item', {
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    product_image: {
        type: DataTypes.STRING,
    }

})

Product.hasMany(Product_item, { foreignKey: 'product_id' })
Product_item.belongsTo(Product, { foreignKey: 'product_id' })

export default Product_item
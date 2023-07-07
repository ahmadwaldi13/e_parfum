import { DataTypes } from 'sequelize'
import Category from './Category.js'
import db from '../config/db.js'

const Product = db.define('product', {
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    product_image: {    
        type: DataTypes.STRING,
        allowNull: false,
    }
})

Category.hasMany(Product, { foreignKey: 'category_id'} )
Product.belongsTo(Category, { foreignKey: 'category_id'} )

export default Product
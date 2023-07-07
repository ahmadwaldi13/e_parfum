import { DataTypes } from 'sequelize'
import Product_item from './ProdItem.js'
import Product_variation_option from './ProdOpt.js'
import db from '../config/db.js'

const Product_configutation = db.define('product_configutation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    product_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'product_items',
            key: 'id'
        },
        
    },
    variation_option_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'product_variation_options',
            key: 'id'
        },
        
    }
}, {
    timestamps: false,
    freezeTableName: true,
})

Product_item.belongsToMany(Product_variation_option, {
    through: Product_configutation,
    foreignKey: 'product_item_id',
})
Product_variation_option.belongsToMany(Product_item, {
    through: Product_configutation,
    foreignKey: 'variation_option_id'
})


export default Product_configutation

import { DataTypes } from 'sequelize'
import ProdItem from './ProdItem.js'
import Order from './Order.js'
import db from '../config/db.js'

const Order_detail = db.define('order_detail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    product_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProdItem,
            key: 'id'
        }
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
})

ProdItem.belongsToMany(Order, {
    through: Order_detail,
    foreignKey: 'product_item_id'
})
Order.belongsToMany(ProdItem, {
    through: Order_detail,
    foreignKey: 'order_id'
})

export default Order_detail
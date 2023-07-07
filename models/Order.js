import { Sequelize, DataTypes } from 'sequelize'
import User from './User.js'
import Payment_method from './PaymentMethod.js'
import Shipping_method from './ShippingMethod.js'
// import Cart from './Cart.js'
import db from '../config/db.js'

const Order = db.define('order', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    payment_method_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Payment_method,
            key: 'id'
        }
    },
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    shipping_method_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Shipping_method,
            key: 'id'
        }
    },
    order_total: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    order_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // cart_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: Cart,
    //         key: 'id'
    //     }
    // },
    transaction_orderId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

User.hasMany(Order, { foreignKey: 'user_id' })
Order.belongsTo(User, { foreignKey: 'user_id' })
Payment_method.hasMany(Order, { foreignKey: 'payment_method_id' })
Order.belongsTo(Payment_method, { foreignKey: 'payment_method_id' })
Shipping_method.hasMany(Order, { foreignKey: 'shipping_method_id' })
Order.belongsTo(Shipping_method, { foreignKey: 'shipping_method_id' })
// Cart.hasMany(Order, { foreignKey: 'cart_id'  })
// Order.belongsTo(Cart, { foreignKey: 'cart_id' })

export default Order
import { DataTypes } from 'sequelize'
import ProdItem from './ProdItem.js'
import Cart from './Cart.js'
import db from '../config/db.js'

const CartItem = db.define('cart_item', {
    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: 'id'
        }
    },
    product_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProdItem,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
})

Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' })
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' })
ProdItem.hasMany(CartItem, { foreignKey: 'product_item_id' })
CartItem.belongsTo(ProdItem, { foreignKey: 'product_item_id' })

export default CartItem
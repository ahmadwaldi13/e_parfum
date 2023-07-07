import { DataTypes } from 'sequelize'
import User from '../models/User.js'
import db from '../config/db.js'

const Cart = db.define('cart', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: false,
})

User.hasMany(Cart, { foreignKey: 'user_id'})
Cart.belongsTo(User, { foreignKey: 'user_id' })

export default Cart
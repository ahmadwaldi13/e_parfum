import { DataTypes } from 'sequelize'
import Payment_type from './PaymentType.js'
import User from './User.js'
import db from '../config/db.js'

const Payment_method = db.define('payment_method', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    payment_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Payment_type,
            key: 'id'
        }
    },
    account_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    expiry_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    bank: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transaction_orderId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: false,
})


Payment_type.hasMany(Payment_method, { foreignKey: 'payment_type_id' })
Payment_method.belongsTo(Payment_type, { foreignKey: 'payment_type_id' })
User.hasMany(Payment_method, { foreignKey: 'user_id' })
Payment_method.belongsTo(User, { foreignKey: 'user_id' })

export default Payment_method
import { DataTypes } from 'sequelize'
import User from './User.js'
import db from '../config/db.js'

const Token = db.define('token', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: false,
    timestamps: false,
})

User.hasOne(Token, { foreignKey: 'user_id' })
Token.belongsTo(User, { foreignKey: 'user_id' })

export default Token




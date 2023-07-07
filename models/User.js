import { DataTypes } from 'sequelize'
import { hashPass } from '../helper/hashPass.js'
import db from '../config/db.js'


const User = db.define('user', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM(['user', 'admin'])
    },
    profile_image: {
        type: DataTypes.STRING
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    hooks: {
        beforeCreate: async (user, opt) => {
            const hashPassword = await hashPass(user.password)
            user.password = hashPassword
        }
    }
})

export default User
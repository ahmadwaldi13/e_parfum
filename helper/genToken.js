import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

export const genToken = async (...payload) => {
    const [ id, username, role ] = payload
    try {
        const token = await jwt.sign({ id, username, role },  process.env.ACCESS_TOKEN, { expiresIn: '24h' })
        return token
    } catch (error) {
        console.info(error.message)
    }
}
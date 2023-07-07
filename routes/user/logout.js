import express from 'express'
import UserController from '../../controllers/UserController.js'

const logout = express.Router()

logout.get('/', UserController.logoutUser)

export default logout
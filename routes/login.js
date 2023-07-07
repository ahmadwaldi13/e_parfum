import express from 'express'
import UserController from '../controllers/UserController.js'
import Validate from '../middlewares/Validate.js'

const login = express.Router()

login.post('/', Validate.login, UserController.login)

export default login
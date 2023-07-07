import { Router } from 'express'
import UserController from '../controllers/UserController.js'
import Validate from '../middlewares/Validate.js'

const register = Router()
register.post('/', Validate.register, UserController.register)

export default register
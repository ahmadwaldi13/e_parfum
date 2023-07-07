import { Router } from 'express'
import UserController from '../controllers/UserController.js'

const verified = Router()

verified.get('/:id/:token', UserController.verified)

export default verified 
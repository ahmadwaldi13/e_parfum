import { Router } from 'express'
import UserController from '../../controllers/UserController.js'
import uploadMiddelware from '../../middlewares/uploadFile.js'
import Validate from '../../middlewares/Validate.js'

const profile = Router()

profile.get('/', UserController.getOneUser)
profile.patch('/update', uploadMiddelware, Validate.updateUser, UserController.updateUser)
profile.delete('/remove/:id', UserController.removeUser)

export default profile
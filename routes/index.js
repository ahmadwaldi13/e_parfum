import { Router } from 'express'
import user from './user/index.js'
import admin from './admin/index.js'
import register from './register.js'
import login from './login.js'
import dashboard from './dashboard.js'
import verified from './verified.js'
import { verfyUser, adminOnly, userOnly } from '../middlewares/authentication.js'

const router = Router()

router.use('/user', verfyUser, userOnly, user)
router.use('/admin', verfyUser, adminOnly, admin)
router.use('/register', register)
router.use('/login', login)
router.use('/', dashboard)
router.use('/verify', verified)

export default router
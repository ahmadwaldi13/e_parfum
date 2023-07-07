import { Router } from 'express'
import profile from './profile.js'
import address from './address.js'
import cartItem from './cartItem.js'
import checkout from './checkout.js'
import payment from './payment.js'
import logout from './logout.js'
import order from './order.js'
import dashboardLogin from './dashboardLogin.js'

const user = Router()

user.use('/', dashboardLogin)
user.use('/profile', profile)
user.use('/address', address)
user.use('/cart', cartItem)
user.use('/checkout', checkout)
user.use('/logout', logout)
user.use('/payment', payment)
user.use('/orders', order)

export default user
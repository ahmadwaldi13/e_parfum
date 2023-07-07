import { Router } from 'express'
import CheckoutController from '../../controllers/CheckoutController.js'

const checkout = Router()

checkout.get('/', CheckoutController.getAllCheckout)
checkout.post('/', CheckoutController.createCheckout)

export default checkout
import { Router } from 'express'
import PaymentController from '../../controllers/PaymentController.js'

const payment = Router()

payment.get(`/:orderId`, PaymentController.getPaymentById)
// payment.post('/notification', PaymentController.paymentNotification)
payment.get('/status/:orderId', PaymentController.statusPayment) 

export default payment
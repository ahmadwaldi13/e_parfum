import { Router } from 'express'
import OrderController from '../../controllers/OrderController.js'

const order = Router()

order.get('/', OrderController.getAllOrder)
order.delete('/:payMentdId', OrderController.cancelOrder)

export default order
import { Router } from 'express'
import CartItemController from '../../controllers/CartItemController.js'

const cartItem = Router()

cartItem.get('/', CartItemController.getAllCartItem)
cartItem.get('/:id', CartItemController.getOneCartItem)
cartItem.post('/', CartItemController.createCartItem)
cartItem.patch('/update', CartItemController.updateCartItem)
cartItem.delete('/remove/:id', CartItemController.removeCartItem)

export default cartItem
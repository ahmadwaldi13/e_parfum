import { Router } from 'express'
import ProductController from '../controllers/ProductController.js'

const dashboard = Router()

dashboard.get('/', ProductController.getAllProduct)
dashboard.get('/product/:id', ProductController.getOneProduct)

export default dashboard
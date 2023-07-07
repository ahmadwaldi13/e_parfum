import { Router } from 'express'
import ProductController from '../../controllers/ProductController.js'
import uploadMiddelware from '../../middlewares/uploadFile.js'
import Validate from '../../middlewares/Validate.js'

const product = Router()

product.get('/', ProductController.getAllProduct)
product.get('/:id', ProductController.getOneProduct)
product.post('/', uploadMiddelware, Validate.createProduct, ProductController.createProduct)
product.patch('/update/:id', uploadMiddelware, ProductController.updateProduct)
product.delete('/remove/:id', ProductController.removeProduct)

export default product
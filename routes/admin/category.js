import { Router } from 'express'
import CategoryController from '../../controllers/CategoryController.js'

const category = Router()

category.get('/', CategoryController.getAllCategory)
category.get('/:id', CategoryController.getOneCategory)
category.post('/', CategoryController.createCategory)
category.patch('/update/:id', CategoryController.updateCategory)
category.delete('/remove/:id', CategoryController.removeCategory)


export default category
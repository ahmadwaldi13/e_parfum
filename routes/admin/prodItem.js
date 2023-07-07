import { Router } from 'express'
import ProdItemController from '../../controllers/ProdItemController.js'
import uploadMiddelware from '../../middlewares/uploadFile.js'
import Validate from '../../middlewares/Validate.js'


const ProdItem = Router()

ProdItem.get('/', ProdItemController.getAllProdItem)
ProdItem.get('/:id', ProdItemController.getOneProdItem)
ProdItem.post('/', uploadMiddelware, Validate.createProdItem, ProdItemController.createProdItem)
ProdItem.patch('/update/:id', uploadMiddelware, ProdItemController.updateProdItem)
ProdItem.delete('/remove/:id', ProdItemController.removeProdItem)

export default ProdItem
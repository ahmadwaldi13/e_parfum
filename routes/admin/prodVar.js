import { Router } from 'express'
import ProdVarController from '../../controllers/ProdVarController.js'

const prodVar = Router()

prodVar.get('/', ProdVarController.getAllProdVar)
prodVar.get('/:id', ProdVarController.getOneProdVar)
prodVar.post('/', ProdVarController.createProdVar)
prodVar.patch('/update/:id', ProdVarController.updateProdVar)
prodVar.delete('/remove/:id', ProdVarController.removeProdVar)

export default prodVar
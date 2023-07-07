import { Router } from 'express'
import AddressController from '../../controllers/AddressController.js'
import Validate from '../../middlewares/Validate.js'

const address = Router()

address.get('/', AddressController.getAllAddress)
address.get('/:id', AddressController.getOneAddress)
address.post('/', Validate.createAddress, AddressController.createAddress)
address.delete('/remove/:addressId', AddressController.removeAddress)
address.patch('/update/:addressId', AddressController.updateAddress)
address.patch('/', AddressController.setMainAddress)

export default address
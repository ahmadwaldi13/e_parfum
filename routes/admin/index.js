import { Router } from 'express'
import product from './product.js'
import profile from './profile.js'
import category from './category.js'
import prodItem from './prodItem.js'
import prodVar from './prodVar.js'
import logout from './logout.js'

const admin = Router()

admin.use('/products', product)
admin.use('/profile', profile)
admin.use('/categories', category)
admin.use('/product_items', prodItem)
admin.use('/product_variations', prodVar)
admin.use('/logout', logout)

export default admin
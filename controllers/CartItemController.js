import CartItem from '../models/CartItem.js'
import ProdItem from '../models/ProdItem.js'
import ProdOpt from '../models/ProdOpt.js'
import Cart from '../models/Cart.js'
import db from '../config/db.js'
import { Op } from 'sequelize'

export default class CartItemController {
    static getAllCartItem = async (req, res) => {
        const userId = req.dataUser.id
        try {
            const results = await Cart.findAll({
                include: [
                    {
                        model: CartItem,
                        include: [
                            {
                                model: ProdItem,
                                include: [
                                    {
                                        model: ProdOpt,
                                        through: { attributes: []},

                                    }
                                ],
                                attributes: { exclude: ['createdAt', 'updatedAt']}
                            }
                        ]
                    }
                ],
                where: {
                    user_id: userId,
                    
                },
                order: [
                    ['id', 'DESC'],
                ]
            })
            return res.status(200).render('pages/cart.ejs', {
                loggedIn: req.cookies.authorization,
                product_cart: results,
                username: req.dataUser.username
            })
        } catch (error) {
            console.info(error.message)
        }
    }
    static getOneCartItem = async (req, res) => {
        const id = req.params.id
        const userId = req.dataUser.id
        try {
            const result =  await CartItem.findOne({
                include: [
                    {
                        model: ProdItem
                    },
                    {
                        model: Cart
                    }
                ],
                where: {
                    id
                }
            })
            if(!result) return res.status(404).json({ msg: 'cart not found'})
            return res.status(200).json(result)
        } catch (error) {
            console.info(error.message)
        }
    }
    static createCartItem = async (req, res) => {
        let { product_item_id, quantity, product } = req.body
        const userId = req.dataUser.id
        const t = await db.transaction()
        try { 
            const dataCartItem = await CartItem.findAll({
                where: { product_item_id  },
                raw: true
            })
           const dataCart = dataCartItem.map( async cart => {
                // mencari cartId yang sama di cart item dan userId yang menambakan cart item
                return await Cart.findOne({ 
                    where: {
                        [Op.and]: [
                            { id: cart.cart_id},
                            { user_id: userId }
                        ]
                    },
                    raw: true
                })
            })
            //results -> hasil dari pencarian cart item dan bentuk nya promise supaya value nya dapat maka memakai Promise.all
            const results = await Promise.all(dataCart)
            let checkCart
            //karena hasil dari promise adalah array maka di forEach kan untuk mencari object
            results.forEach(cart => {
                if(cart !== null) {
                    checkCart = cart
                }
            })
            //mencari product item yang di tambahka ke cart item
            const prodItem = await ProdItem.findOne({
                where: {
                    id: product_item_id
                },
                raw: true
            })
            let cartItem
            if(checkCart) {
                /*
                    kondisi checkCart -> jika product item sudah ada di cart item
                    maka yang di ubah quantity dan total price
                */
                //cartItemOne -> mencari cart item dimana cartId sama dengan yang di tambahkan ke cart item
                const cartItemOne = await CartItem.findOne({
                    where: {
                        cart_id: checkCart.id
                    },
                    raw: true
                })
                //quantity -> quantity dari body di tambahkan dengan Cart item quantity yang berada di db
                quantity = +quantity + cartItemOne.quantity
                //resultPrice -> quantity yang sudah di tambahkan tadi di kali dengan product item price
                const resultPrice = quantity * prodItem.price
                /*
                    cartItem -> mengupdate hasil dari quntity dan price yang di tambahkan user
                    supaya cart item yang sudah berada di database tidak di create
                    tapi yang berubah adalah quantity dan price
                */
                cartItem = await CartItem.update({
                    quantity,
                    total_price: resultPrice
                }, {
                    where: {  product_item_id }
                }, {    
                    trancation: t
                })
            }else {
                /*
                    untuk else ini jika user menambahkan product item ke cart item tapi di cart tidak ada
                    product item yang sama, maka langsung di create.
                */
                const cart = await Cart.create({
                    user_id: userId,
                }, {
                    transaction: t
                })
                const resultPrice = +quantity * prodItem.price
                cartItem = await CartItem.create({
                    cart_id: cart.toJSON().id,
                    product_item_id,
                    total_price: resultPrice,
                    quantity,      
                }, {    
                    transaction: t
                })
            }
            if(cartItem) res.render('pages/detail_product.ejs', {
                product,
                loggedIn: req.cookies.authorization
            })
            await t.commit()
        } catch (error) {
            console.info(error.message)
            await t.rollback()
        }
    }
    static updateCartItem = async (req, res) => {
        let { quantity, is_default, cartItemId } = req.body
        const newQuantity = quantity
        is_default = is_default === undefined ? is_default = false : is_default
        console.info(is_default)
        try {
            const dataCartItem = await CartItem.findOne({ 
                where: {
                    id: cartItemId
                },
                include: [
                    { 
                        model: ProdItem,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'product_id']}
                    }
                ],
                attributes: { exclude: ['product_item_id']}
            })
            if(!dataCartItem) return res.status(404).json({ msg: 'cart not found'})
            const { quantity, total_price, product_item } = dataCartItem.toJSON()
            let resultPrice
            if(newQuantity > quantity) {
                resultPrice = newQuantity * product_item.price
            }else if(newQuantity < quantity) {
                resultPrice = total_price - product_item.price   
            }    
            const [ response ] = await CartItem.update({
                quantity: newQuantity,
                total_price: resultPrice,
                is_default: is_default
            }, {
                where: { id: cartItemId },
            })
            const dataUpdateCartItem = await CartItem.findOne({
                where: {
                    id: cartItemId,
                },
                attributes: ['id', 'quantity', 'total_price'],
                raw: true
            })
            if(response > 0) {
                return res.json({
                    msg: 'Successfully updated',
                    quantity: dataUpdateCartItem.quantity,
                    total_price: dataUpdateCartItem.total_price,
                })
            }
        } catch (error) {
            console.info(error.message)
        }
    }
    static removeCartItem = async (req, res) => {
        const cartItemId = req.params.id
        const t = await db.transaction()
        try {
            const dataCartItem = await CartItem.findOne({
                where: { id: cartItemId }
            })
            if(!dataCartItem) return res.status(404).json({ msg: 'cart not found '})
            const response = await CartItem.destroy({
                where: { id: cartItemId }
            }, {
                trancation: t
            })
            await Cart.destroy({
                where: {
                    id: dataCartItem.toJSON().cart_id
                }
            }, {
                trancation: t
            })
            if(response > 0) res.redirect('/user/cart')
            await t.commit()
        } catch (error) {
            console.info(error.message)
            await t.rollback()
        }
    }
}
import Order from '../models/Order.js'
import Payment_method from '../models/PaymentMethod.js'
// import Cart from '../models/Cart.js'
import User from '../models/User.js'
import Shipping_method from '../models/ShippingMethod.js'
import ProdItem from '../models/ProdItem.js'
import { Op } from 'sequelize'
import db from '../config/db.js'

export default class OrderController {
    static getAllOrder = async (req, res) => {
        const userId = req.dataUser.id
        const t = await db.transaction()
        try {
            let orders = await Order.findAll({ 
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password', 'createdAt', 'updatedAt']}
                    },
                    {
                        model: Shipping_method,
                    },
                    {
                        model: Payment_method
                    },
                    // {
                    //     model: Cart
                    // },
                    {
                        model: ProdItem
                    }
                ],
                where: {
                    user_id: userId
                }
            })
            orders.forEach( async order => {
                if(order.order_status === 'expire') {
                    const prodItemQty = order.product_items[0].quantity
                    const resultOrderQty = order.product_items[0].order_detail.quantity
                    const resultQty = resultOrderQty + prodItemQty
                    await ProdItem.update({
                        quantity: resultQty
                    }, {
                        where: { id: order.product_items[0].id },
                    }, {
                        transaction: t
                    })
                    // await Payment_method.destroy({
                    //     where: { id: order.payment_method_id}
                    // }, {
                    //     transaction: t
                    // })
                    // await Cart.destroy({
                    //     where: {
                    //         id: order.cart_id
                    //     }
                    // })
                }
            })
            res.render('pages/orders.ejs', {
                loggedIn: req.cookies.authorization,
                username: req.dataUser.username,
                orders
            })
            // res.status(200).json(orders)
            await t.commit()
        } catch (error) {
            console.error(error)
            await t.rollback()
        }
    }
    static cancelOrder = async (req, res) => {
        const payMentdId = +req.params.payMentdId
        const userId = +req.dataUser.id
        const orderId = req.body.transaction_orderId
        const t = await db.transaction()
        try {
            //cari semua orders untuk di validasi
            const orders = await Order.findAll({
                include: [
                    {
                        model: ProdItem
                    }
                ],
                where: {
                    [Op.and]: [
                        {user_id: userId},
                        {transaction_orderId: orderId}
                    ]
                }
            })
            //kemungkinan orders dari user bisa lebih dari 1, jadi di lakukan perulangan
            orders.forEach( async order => {
                /*
                    jika user remove/cancel order:
                    maka quntity yang di order, akan di tambahkan dengan quantity
                    product item. kemudian hasil dari quantity yang di tambahkan tadi,
                    di update ke product item yang di order. setelah itu baru hapus cart dari
                    user yang order.
                */
                const prodItemQty = order.product_items[0].quantity
                const resultOrderQty = order.product_items[0].order_detail.quantity
                const resultQty = resultOrderQty + prodItemQty
                await ProdItem.update({
                    quantity: resultQty
                }, {
                    where: { id: order.product_items[0].id },
                }, {
                    transaction: t
                })
                // await Cart.destroy({
                //     where: {
                //         id: order.cart_id
                //     }
                // })
            })
            /*
                setelah logic quantity, baru hapus order tapi berdasarkan payment method dari order
                karena ketika remove payment method otomatis order dan order detail akan terhapus juga.
            */
            const payMethodRes = await Payment_method.destroy({
                where: {
                    [Op.and]: [
                        { id: payMentdId },
                        { user_id: userId }
                    ]
                }
            }, {
                transaction: t
            })
            if(payMethodRes > 0) return res.status(200).json({ msg: 'order has been removed'})
        }catch(error) {
            console.info(error.message)
        }
    }
}
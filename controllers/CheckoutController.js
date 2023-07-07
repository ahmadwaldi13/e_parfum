import Address from '../models/Address.js'
import CartItem from '../models/CartItem.js'
import Cart from '../models/Cart.js'
import ProdItem from '../models/ProdItem.js'
import User from '../models/User.js'
import Payment_method from '../models/PaymentMethod.js'
import Payment_type from '../models/PaymentType.js'
import Shipping_method from '../models/ShippingMethod.js'
import Order from '../models/Order.js'
import { paymentMidtrans } from '../helper/payment.js'
import Order_detail from '../models/OrderDetail.js'
import { format } from 'date-fns'
import { Op } from 'sequelize'
import db from '../config/db.js'

export default class CheckoutController {
    static getAllCheckout = async (req, res) => {
        console.log('hello world')
        const userId = req.dataUser.id
        try {
            const userAddress = await Address.findOne({
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
                    }
                ],
                where: {
                    [Op.and]: [
                        {user_id: userId},
                        {is_default: true}
                    ]
                },
            })
            if(!userAddress) return res.json({ msg: 'please enter your address'})
            const cartItem = await CartItem.findAll({
                include: [
                    {
                        model: ProdItem,
                        attributes: { exclude: ['createdAt', 'updatedAt'] }
                    },
                    {
                        model: Cart
                    }
                ],
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            })
            const cartItemUser = cartItem.map(item => {
                if(item.cart.user_id === userId && item.is_default === true){
                    return item
                }
            })
            .filter(item => item !== undefined)
            let subtotal = 0
            cartItemUser.forEach(item => {
                return subtotal += item.total_price
            })
            return res.status(200).render('pages/checkout.ejs', {
                loggedIn: req.cookies.authorization,
                username: req.dataUser.username,
                userAddress: userAddress.toJSON(),
                cartItemUser,
                subtotal
            })
        } catch (error) {
            console.info(error.message)
        }
    }
    static createCheckout = async (req, res) => {
        const userId = req.dataUser.id
        const t = await db.transaction()
        let { 
            payment_type, 
            payment_method, 
            order_total,
            user_address,
            cart_item_user,
            shipping_method
        } = req.body
        //membuat orderId random dengan packet 'date-fns' untuk orderId di midtrans
        function generateOrderId() {
            const timestamp = format(new Date(), 'yyyyMMddHHmmss')
            const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
            const orderId = `ORDER-${timestamp}-${randomDigits}`
            return orderId;
        }
        const orderId = generateOrderId()
        try {
            //membuat items_details dari cart yang 'is_default' nya true/cart yang di pilih oleh user
            const item_details = cart_item_user.map(item => {
                return {
                    id: item.id,
                    price: item.product_item.price,
                    quantity: item.quantity,
                    name: item.product_item.name
                }
            })
            //membuat customer_details untuk membuat payment midtrans nya lebih lengkap
            const customer_details = {
                frist_name: '',
                last_name: user_address.name,
                email: user_address.user.email,
                phone: user_address.phone_number,
                address: user_address.detail_address,
                city: user_address.city,
                subdistrict: user_address.subdistrict,
                postal_code: user_address.postal_code,
                billing_address: {
                    frist_name: '',
                    last_name: user_address.name,
                    email: user_address.user.email,
                    phone: user_address.phone_number,
                    address: user_address.detail_address,
                    city: user_address.city,
                    postal_code: user_address.postal_code
                }
            }
            //membuat shipping address/alamat pengiriman untuk di mengirim ke API nya midtrans
            const shipping_address = {
                    frist_name: '',
                    last_name: user_address.name,
                    email: user_address.user.email,
                    phone: user_address.phone_number,
                    address: user_address.detail_address,
                    city: user_address.city,
                    subdistrict: user_address.subdistrict,
                    postal_code: user_address.postal_code
            }
            //paymentMidtrans -> function yang ada di folder 'helpers' dan di folder helpers setup untuk midtrans nya
            //dan yang di buat di atas tadi di buat object dan dikirim ke parameter di fucntion paymentMidtrans
            const pay = await paymentMidtrans({
                payment_type,
                payment_method,
                orderId,
                order_total,
                item_details,
                customer_details,
                shipping_address,
            })
            //membuat payment type/tipe pembayaran
            const payType = await Payment_type.findAll()
            /*
                kemudian check data name di payment type apakah ada name yang sama yang di pilih oleh user
                jika ada maka akan di ambil ID nya saja, dan jika tidak ada maka akan di create data name
                yang di kirim oleh user.
            */
           let payTypeData
           if(payType || payType.length !== 0) {
               payType.forEach(pt => {
                   if(pt.name === pay.payment_type) {
                       payTypeData = pt
                    }
                })
            }else {
                payTypeData = await Payment_type.create({
                    name: pay.payment_type
                }, {
                    transaction: t
                })
            }
            //membuat Payment method dan masukan id payment type yang baru di buat tadi ke payment method
            const payMethodData = await Payment_method.create({
                user_id: userId,
                payment_type_id: payTypeData.toJSON().id,
                account_number: pay.va_numbers[0].va_number,
                expiry_date: pay.expiry_time,
                bank: pay.va_numbers[0].bank,
                transaction_orderId: pay.order_id,
            }, {
                transaction: t
            })
            //membuat shipping method/metode pengiriman
            const shippingMethod = await Shipping_method.findAll()
            /*
                kemudian check data name di payment method apakah ada name yang sama yang di pilih oleh user
                jika ada maka akan di ambil ID nya saja, dan jika tidak ada maka akan di create data name
                yang di kirim oleh user.
            */
            let shippingMethodData
            if(!shippingMethod || shippingMethod.length !== 0) {
                shippingMethod.forEach(sm => {
                    if(sm.name === shipping_method) {
                        shippingMethodData = sm
                    }
                })
            }else {
                shippingMethodData = await Shipping_method.create({
                    name: shipping_method
                }, {
                    transaction: t
                })
            }
            //membuat order/pesanan
            const order = cart_item_user.map( async item => {
                /*
                jika cart item lebih dari 1 maka kita akan 'map' dan create order nya lebih dari 1 kali karena 
                cart id nya butuh lebih dari 1, jika 1 maka akan di 'map' juga tapi hanya 1
                */
               const createOrder = await Order.create({
                    user_id: userId,
                    order_date: pay.transaction_time,
                    payment_method_id: payMethodData.toJSON().id,
                    shipping_address: JSON.stringify(user_address),
                    shipping_method_id: shippingMethodData.toJSON().id,
                    order_total: order_total,
                    order_status: pay.transaction_status,
                    transaction_orderId: pay.order_id,
                }, {
                    transaction: t
                })
                //mengubah quantity product item 
                const prodItem = await ProdItem.findOne({
                    where: {
                        id: item.product_item_id
                    },
                    raw: true
                })
                const updateQuantity = prodItem.quantity - parseInt(item.quantity)
                await ProdItem.update({
                    quantity: updateQuantity
                }, {
                    where: {
                        id: prodItem.id
                    }
                }, {
                    transaction: t
                })
                //hapus product di cart item
                await CartItem.destroy({
                    where: {
                        [Op.and]: [
                            {id: item.id},
                            {is_default: true}
                        ]
                    },
                }, {
                    transaction: t
                })
                await Cart.destroy({
                    where: {
                        id: item.cart_id,
                    },
                    transaction: t
                })                
                return createOrder.toJSON()
            })
            //karena return dari 'map' promise maka kita butuh 'Promise All' untuk mendapatkan value nya
            const dataOrder = await Promise.all(order)
            //ketika sudah membuat order kemudian create order_detail
            const order_detail = dataOrder.map( async (order, i) => {
                    const cartItemUser =  cart_item_user[i] 
                    const createOrderDetail = await Order_detail.create({
                        product_item_id: cartItemUser.product_item_id,
                        order_id: order.id,
                        quantity: cartItemUser.quantity,
                        price: cartItemUser.product_item.price
                    }, {
                        transaction: t   
                    })
                    return createOrderDetail.toJSON()
            })
            await Promise.all(order_detail)
            res.status(201).json({ msg: 'Order has been created'})
            await t.commit()
        } catch (error) {
            console.info(error.message)
            await t.rollback()
        }
    }
}
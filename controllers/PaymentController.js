import Payment_method from '../models/PaymentMethod.js'
import Payment_type from '../models/PaymentType.js'
import Order from '../models/Order.js'
import { paymentNotification, statusPayment } from '../helper/payment.js'
import { Op } from 'sequelize'

export default class PaymentController {
    static getPaymentById = async (req, res) => {
        const userId = req.dataUser.id
        const transaction_orderId = req.params.orderId
        try {
            const getPayment = await Payment_method.findAll({
                include: [
                    {
                        model: Payment_type,
                        as: 'Payment_type'
                    }
                ],
                where: {
                    [Op.and]: [
                        {user_id: userId},
                        {transaction_orderId: transaction_orderId},
                    ]
                }
            })
            const responseStatus = await statusPayment(transaction_orderId)
            switch(responseStatus.transaction_status) {
                case 'expire':
                    return res.json({ msg: 'Payment is expired!'})
                    break
                case 'cancel':
                    return res.json({ msg: 'Payment is canceled!'})
                    break
                case 'settlement': 
                    return res.json({ msg: 'Payment is settlement'})
                    break
                case 'deny':
                    return res.json({ msg: 'Payment is deny!'})
                    break
            }
            await Order.update({
                order_status: responseStatus.transaction_status
            }, {
                where: {
                    transaction_orderId: transaction_orderId
                }
            })
            if(getPayment) return res.status(200).json(getPayment)
        } catch (error) {
            console.info(error.message)
        }
    }
    // static paymentNotification = async (req, res) => {
    //     const resultPay = req.body
    //     try {
    //         const responseStatus = await paymentNotification(resultPay)
    //         console.info(responseStatus)
    //     } catch (error) {
            
    //     }
    // }
    static statusPayment = async (req, res) => {
        const orderId = req.params.orderId
        try {
            const responseStatus = await statusPayment(orderId)
            await Order.update({
                order_status: responseStatus.transaction_status
            }, {
                where: { transaction_orderId: orderId }
            })
            switch(responseStatus.transaction_status) {
                case 'pending':
                    return res.json({ msg: 'pending'})
                    break
                case 'expire':
                    return res.json({ msg: 'expired'})
                    break
                case 'cancel':
                    return res.json({ msg: 'canceled'})
                    break
                case 'settlement': 
                    return res.json({ msg: 'settlement'})
                    break
                case 'deny':
                    return res.json({ msg: 'deny'})
                    break
                default:
                    return res.json({ msg: `${responseStatus.transaction_status}` })
            }
        } catch (error) {
            console.info(error.message)
        }
    }
}
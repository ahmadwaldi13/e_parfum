import Address from '../models/Address.js'
import User from '../models/User.js'
import { Op } from 'sequelize'
import db from '../config/db.js'

export default class AddressController {
    static getAllAddress = async (req, res) => {    
        const userId = req.dataUser.id
        try {
            const results = await Address.findAll({
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password', 'createdAt', 'updatedAt']}
                    }
                ],
                attributes: { exclude: ['createdAt', 'updatedAt']},
                where: {
                    user_id: userId
                }
            })
            return res.status(200).render('pages/address.ejs', {
                loggedIn: req.cookies.authorization,
                address: results,
                userId,
                username: req.dataUser.username,
                msg: "You don't have an address yet, please create one now"
            })
        } catch (error) {
            console.info(error.message)
        }
    }
    static getOneAddress = async (req, res) => {
        const addressId = req.params.id
        const userId = req.dataUser.id
        try {
            const result = await Address.findOne({ 
                where: { 
                   [Op.and] : [
                        {id: addressId},
                        {user_id: userId}
                   ]
                },
                raw: true
            })
            if(!result) return res.status(404).json({ msg: 'address not found' })
            return res.status(200).json(result)
        } catch (error) {
            console.info(error.message)
        }
    }
    static createAddress = async (req, res) => {
        const userId = req.dataUser.id
        const { name, phone_number, province, city, subdistrict, postal_code, detail_address } = req.body
        try {
           const address = await Address.create({
                user_id: userId,
                name,
                phone_number,
                province,
                city,
                subdistrict,
                postal_code,
                detail_address
            })
            if(address) res.redirect('/user/address')
        } catch (error) {
            console.info(error.message)
        }
    }
    static updateAddress = async (req, res) => {
        const addressId = req.params.addressId
        let { name, phone_number, province, city, subdistrict, postal_code, detail_address } = req.body
        try {
            const response = await Address.update({
                name,
                phone_number,
                province,
                city,
                subdistrict,
                postal_code,
                detail_address   
            }, {
                where: { id: +addressId }
            })
            if(response > 0) res.redirect('/user/address')
        } catch (error) {
            console.info(error.message)
        }
    }
    static removeAddress = async (req, res) => {
        const addressId = +req.params.addressId
        try {
            const response = await Address.destroy({ where: { id: addressId } })
            if(response > 0) return res.redirect('/user/address')
        } catch (error) {
            console.info(error.message)
        }
    }
    static setMainAddress = async (req, res) => {
        const userId = req.dataUser.id
        const addressId = +req.body.addressId
        const t = await db.transaction()
        try {
            const address = await Address.findAll({
                where: { user_id: userId},
                raw: true
            })
            const [ filterAddress ] = address.filter(addr => {
                const { is_default } = addr
                return is_default === 1
            })
            if(filterAddress?.is_default === 1 ) {
                await Address.update({ 
                    is_default: 0
                }, {
                    where: { id: filterAddress.id }
                }, {
                    transaction: t
                })
            }
            const response = await Address.update({
                is_default: 1
            }, {
                where: { 
                    [Op.and]: [
                        {id: addressId},
                        {user_id: userId}
                    ]
                 }
            }, {
                transaction: t
            })
            if( response > 0) res.redirect('/user/address')
            await t.commit()
        } catch (error) {
            console.info(error.message)
            await t.rollback()
        }
    }
}
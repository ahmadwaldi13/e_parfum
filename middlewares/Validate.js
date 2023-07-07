import Validator from 'validatorjs'
import User from '../models/User.js'
import { comparePass } from '../helper/hashPass.js'
import fs from 'fs/promises'
import { Op } from 'sequelize'

export default class Validate {
    static register = async (req, res, next) => {
        const data = req.body
        const rules = {
            username: 'required',
            email: 'required|email',
            phone_number: 'required',
            password: 'required|min:8',
            confirm_password: 'required|same:password',
        }
        try {
            const validation = new Validator(data, rules)
            const emailUnique = await User.findOne({ where: { email: data.email }})
            const usernameUnique = await User.findOne({ where: { username: data.username }})
            if(usernameUnique) validation.errors.add('username', 'Username has been registered.')
            if(emailUnique) validation.errors.add('email', 'Email has been registered.')
            validation.passes()
            validation.fails() 
            console.log(validation.errors.all())
            const errors = validation.errors.all()
            if(Object.keys(errors).length === 0) {
                return next()
            }else {
                console.log(errors)
                return res.status(400).json({
                    errors: errors
                })
            }
        } catch (error) {
            console.info(error.message)
        }
    }
    static login = async (req, res, next) => {
        const data = req.body
        console.info(req.body.password)
        const rules = {
            email: 'email'
        }
        try {
            const validation = new Validator(data, rules)
            const dataUser = await User.findOne({ where: { email: data.email }, raw: true})
            if(data.email && data.password) {
                if(!dataUser){
                    validation.errors.add('email', 'email not registered!')
                }else {
                    const isCorrectPass = await comparePass(data.password, dataUser.password)
                    if(!isCorrectPass) validation.errors.add('password', 'wrong password!')
                } 
            }
            if(dataUser && dataUser.verified === false) {
                validation.errors.add('verified', 'please verify your account in email!')
            }
            validation.fails() 
            validation.passes()
            const errors = validation.errors.all()
            if(Object.keys(errors).length === 0) {
                return next()
            }else {
                return res.status(400).json({
                    errors: errors
                })
            }
        } catch (error) {
            console.info(error.message)
        }
    }
    static updateUser = async (req, res, next) => {
        const data = req.body
        const userId = req.dataUser.id
        const rules = {
            email: 'email',
        }
        try {
            const validation = new Validator(data, rules)
            const dataUser = await User.findOne({
                where: {
                    id: userId,
                },
                raw: true,
                attributes: { exclude: ['password', 'verified', 'createdAt', 'updatedAt'] }
            })
            if(data.username) {
                const usernameUnique = await User.findOne({ 
                    where: { 
                        username: data.username,
                        id: { [Op.ne]: userId }
                    },
                    raw: true,
                })
                if(usernameUnique) validation.errors.add('username', 'Username has been registered.') 
            }
            if(data.email) {
                const emailUnique = await User.findOne({ 
                    where: { 
                        email: data.email,
                        id: { [Op.ne]: userId }
                    },
                    raw: true,
                    attributes: { exclude: ['password', 'verified', 'createdAt', 'updatedAt'] }
                })
                if(emailUnique) validation.errors.add('email', 'Email has been registered.')
            }
            validation.fails() 
            validation.passes()
            const errors = validation.errors.all()
            if(Object.keys(errors).length === 0) {
                return next()
            }else {
                return res.status(400).render('pages/profile.ejs',{
                    errors: JSON.stringify(errors),
                    user: dataUser,
                    token: req.cookies.authorization
                })
            }
        } catch (error) {
            console.info(error.message)
        }
    }
    static createProduct = async (req, res, next) => {
        const data = req.body
        const rules = {
            category_id: 'required|integer',
            name: 'required',
            description: 'required',
        }
        const validation = new Validator(data, rules)
        validation.passes()
        validation.fails() 
        const errors = validation.errors.all()
        if(Object.keys(errors).length === 0) {
            return next()
        }else {
            return res.status(400).json(errors)
        }
    }
    static createProdItem = async (req, res, next) => {
        const { product_id, name, quantity, price, variationId, value_option } = req.body
        const product_image = req.files?.product_image
        const data = {
            product_id,
            name, 
            quantity, 
            price,
            product_image,
            variationId,
            value_option
        }
        const rules = {
            product_id: 'required',
            name: 'required',
            quantity: 'required',
            price: 'required',
            product_image: 'required',
            variationId: 'required',
            value_option: 'required'
        }
        const validation = new Validator(data, rules)
        validation.passes()
        validation.fails()
        if(validation.fails()) {
            if(product_image) {
                const [ fileImage ] = product_image
                const { filename } = fileImage
                const pathImage = `./public/images/products/${filename}`
                fs.unlink(pathImage)
            }
        }
        const errors = validation.errors.all()
        if(Object.keys(errors).length === 0) {
            return next()
        }else {
            return res.status(400).json(errors)
        }
    }
    static createAddress = async (req, res, next) => {
        const data = req.body
        const rules = {
            name: 'required',
            phone_number: 'required',
            province: 'required',
            city: 'required',
            subdistrict: 'required',
            postal_code: 'required',
            detail_address: 'required'
        }
        const validation = new Validator(data, rules)
        validation.passes()
        validation.fails() 
        const errors = validation.errors.all()
        if(Object.keys(errors).length === 0) {
            return next()
        }else {
            return res.status(400).json(errors)
        }
    }
}
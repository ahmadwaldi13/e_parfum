import User from '../models/User.js'
import db from '../config/db.js'
import { config } from 'dotenv' 
import { genToken } from '../helper/genToken.js'
import sendMail from '../helper/sendMail.js'
import Token from '../models/Token.js'
import fs from 'fs/promises'
config()

export default class UserController { 
    static register = async (req, res) => {
        const { username, email, phone_number ,password } = req.body
        const t = await db.transaction()
        const role = email === process.env.EMAIL_ADMIN && username === process.env.USERNAME_ADMIN ? 'admin' : 'user'
        try {
            const createUser = await User.create({
                username,
                password,
                email,
                phone_number,
                role
            }, {
                transaction: t,
                raw: true
            })
            const id = createUser.id
            const token = await genToken(id, username, email)
            await Token.create({
                user_id: id,
                token
            },{
                transaction: t
            })
            await sendMail({
                email,
                username,
                subject: 'Verify your account',
                userId: createUser.id,
                token
            })
            if(createUser) res.status(201).json({
                msg: 'Successfully register, please check email to verify your account'
            })
            await t.commit()
        } catch (error) {
            console.info(error)
            await t.rollback()
        }   
    }
    static login = async (req, res) => {
        const { email } = req.body
        const result = await User.findOne({ 
            where: { email },
            raw: true
        })
        try {
            const { id, username, role } = result
            console.info(id)
            const token = await genToken(id, username, role)
            res.cookie('authorization', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 10 * 1000
            })
            if(role === 'user') {
                return res.json({
                    msg: 'seuccssfully Login'
                })
            }else {
                return res.redirect('/admin')
            }
        } catch (error) {
            console.info(error.message)
        }
    }
    static getAllUser = async (req, res) => {
        try {
            const results = await User.findAll()
            if(results.length === 0) return res.status(404).json({ msg: 'User not found'})
            return res.status(200).json(results)
        } catch (error) {
            console.info(error.message)
        }
    }
    static getOneUser = async (req, res) => {
        const id = req.dataUser.id
        try {
            const result = await User.findOne({
                where: {
                    id
                },
                raw: true,
                attributes: { exclude:['password', 'createdAt', 'updatedAt', 'verified'] }
            })
            if(!result) return res.status(404).json({ msg: 'User not found' })
            return res.status(200).render('pages/profile.ejs', {
                loggedIn: req.cookies.authorization,
                user: result,
                userId: id,
                username: req.dataUser.username
            })
        } catch (error) {
            console.info(error.message)
        }
    }
    static updateUser = async (req, res) => {        
        const id = req.dataUser.id  
        const file = req.files?.profile_image
        const dataUser = await User.findOne({
            where: {
                id
            },
            raw: true,
            attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'verified']}
        })
        if(!dataUser) return res.status(404).json({ msg: 'User not found' })
        const { profile_image } = dataUser
        const imageName = () => {
            const splitUrl = profile_image.split('/')
            return splitUrl[splitUrl.length - 1]
        }
        let tempImage
        if(!file) {
            tempImage = profile_image !== null ? imageName() : profile_image
        }else {
            if(profile_image) {
                const imagePath = `./public/images/profiles/${imageName()}`
                fs.unlink(imagePath)
            }
            const [ fileImage ] = file
            tempImage = fileImage.filename
        }
        let fileImageUrl = null
        if(tempImage !== null) fileImageUrl = `${req.protocol}://${req.get('host')}/images/profiles/${tempImage}`
        try {
            let { username, email, phone_number } = req.body
            const [ response ] = await User.update({
                username,
                email,
                phone_number,
                profile_image: fileImageUrl
            }, {
                where: {
                    id
                }
            })
            if(response === 0 && file === true) {
                const imagePath = `./public/images/profiles/${imageName()}`
                fs.unlink(imagePath)
                return false
            }
            if(response > 0) {
               const newDataUser = await User.findOne({
                    where: {
                        id
                    },
                    raw: true,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'verified']}
                })
                return res.status(200).render('pages/profile.ejs',{
                    msg: 'Profile updated successfully',
                    loggedIn: req.cookies.authorization,
                    user: newDataUser,
                    username: newDataUser.username
                })
            } 
        } catch (error) {
            console.info(error.message)
        }
    }
    static removeUser = async (req, res) => {
        const id = req.params.id
        try {
            const dataUser = await User.findByPk(id)
            if(!dataUser) return res.status(404).json({ msg: 'User not found' })
            const { profile_image } = dataUser.toJSON()
            if(profile_image) {
                const splitUrl = profile_image.split('/')
                const imageName = splitUrl[splitUrl.length - 1]
                const imagePath = `./public/images/profiles/${imageName}`
                fs.unlink(imagePath)  
            } 
            const response = await User.destroy({ where: { id } })
            if(response > 0) return res.status(200).json({ msg: 'User deleted successfully'})
        } catch (error) {
            console.info(error.message)
        }
    }
    static verified = async (req, res) => {
        const userId = req.params.id
        const token = req.params.token
        try {
            const user = await User.findOne({ 
                where: { id: userId}
            })
            if(!user) return res.status(400).json({ msg: 'invalid link' })
            const tokenVerify = await Token.findOne({
                where: { token }
            })
            if(!token) return res.status(400).json({ msg: 'invalid link' })
            await User.update({
                verified: true
            }, {
                where: {
                    id: userId
                }
            })
            await Token.destroy({ 
                where: { id: tokenVerify.toJSON().id}
            })
            return res.status(200).render('pages/verfy_user.ejs', {
                msg: 'Successfully Verification'
            })
        } catch (error) {
            console.info(error.message)
        }
    }
    static logoutUser = (req, res) => {
        const cookie = req.cookies['authorization']
        if(cookie) {
            res.clearCookie('authorization')
            return res.redirect('/')
        }else {
            return res.status(400).json({ msg: 'User is not logged in'})
        }
    }
}
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import ProdOpt from '../models/ProdOpt.js'
import ProdVar from '../models/ProdVar.js'
import fs from 'fs/promises'
import Product_item from '../models/ProdItem.js'

export default class ProductController {
    static getAllProduct = async (req, res) => {
        try {
            const results = await Product.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category'
                    },
                    {
                        model: Product_item,
                        as: 'product_items',
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        include: [{
                            model: ProdOpt,
                            attributes: { exclude: ['product_variation_id']},
                            through: { attributes: []},
                            include: [{
                                model: ProdVar,
                                attributes: { exclude: ['createdAt', 'updatedAt']}
                            }]
                        }]
                    },
                ],
                attributes: { exclude: [ 'category_id', 'createdAt', 'updatedAt' ]},
            })
            if(results.length === 0) return res.status(404).json({ msg: 'Product not found' })
            if(req.cookies.authorization) {
                return res.status(200).render('pages/home.ejs', {
                    products: results,
                    loggedIn: req.cookies.authorization,
                    username: req.dataUser.username
                })
            }else {
                return res.status(200).render('pages/home.ejs', {
                    products: results
                })
            }
        } catch (error) {
            console.info(error)
        }
    }
    static getOneProduct = async (req, res) => {
        const id = req.params.id
        try {
            const result = await Product.findOne({
                where: {
                    id
                },
                include: [
                    {
                        model: Category,
                        as: 'category'
                    },
                    {
                        model: Product_item,
                        as: 'product_items',
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        include: [{
                            model: ProdOpt,
                            attributes: { exclude: ['product_variation_id']},
                            through: { attributes: []},
                            include: [{
                                model: ProdVar,
                                attributes: { exclude: ['createdAt', 'updatedAt']}
                            }]
                        }]
                    }
                ],
                attributes: { exclude: [ 'category_id', 'createdAt', 'updatedAt' ]}
            })
            if(!result) return res.status(404).json({ msg: 'Product not found' })
            if(req.cookies.authorization) {
                return res.status(200).render('pages/detail_product.ejs', {
                    product: result.toJSON(),
                    loggedIn: req.cookies.authorization,
                    username: req.dataUser.username
                })
            }else {
                return res.status(200).render('pages/detail_product.ejs', {
                    product: result.toJSON()
                })
            }
        } catch (error) {
            console.info(error.message)
        }
    }
    static createProduct = async (req, res) => {
        const file = req.files.product_image
        if(!file) return res.status(400).json({ msg: 'Product image not uploaded!' })
        const [ fileImage ] = file
        const { filename } = fileImage
        const fileProductUrl = `${req.protocol}://${req.get('host')}/images/products/${filename}`
        try {
            const { category_id, name, description } = req.body
            const response = await Product.create({
                category_id,
                name,
                description,
                product_image: fileProductUrl
            })
            if(response) return res.status(201).json({ msg: 'Product added successfully'})
        } catch (error) {
            console.info(error.message)
        }
    }
    static updateProduct = async (req, res) => {
        const id = req.params.id
        const file = req.files?.product_image
        const dataProduct = await Product.findByPk(id)
        if(!dataProduct) return res.status(404).json({ msg: 'Product not found' })
        const { product_image } = dataProduct.toJSON()

        const imageName = () => {
            const splitUrl = product_image.split('/')
            return splitUrl[splitUrl.length - 1]
        }
        let tempImageName
        if(!file) {
            tempImageName = imageName()
        }else {
            const pathImage = `./public/images/products/${imageName()}`
            fs.unlink(pathImage)
            const [ fileImage ] = file
            const { filename } = fileImage
            tempImageName = filename
        }
        const fileProductUrl = `${req.protocol}://${req.get('host')}/images/products/${tempImageName}`
        try {
            let { category_id, name, description } = req.body
            const [ response ] = await Product.update({
                category_id,
                name,
                description,
                product_image: fileProductUrl
            }, {
                where: {
                    id
                }
            })
            if(response === 0 && file === true) {
                const pathImage = `./public/images/products/${imageName()}`
                fs.unlink(pathImage)
                return false
            }
            if(response > 0) return res.status(200).json({ msg: 'Product updated successfully'})
        } catch (error) {
            console.info(error)
        }
    }
    static removeProduct = async (req, res) => {
        const id = req.params.id
        const dataProduct = await Product.findByPk(id)
        if(!dataProduct) return res.status(404).json({ msg: 'Product not found' })
        const { product_image } = dataProduct.toJSON()
        const splitUrl = product_image.split('/')
        const imageName = splitUrl[splitUrl.length - 1]
        const pathImage = `./public/images/products/${imageName}`
        fs.unlink(pathImage)
        try {
            const response = await Product.destroy({ where: { id }})
            if(response > 0) return res.status(200).json({ msg: 'Product removed successfully'})
        } catch (error) {
            console.info(error.message)
        }
    }
}
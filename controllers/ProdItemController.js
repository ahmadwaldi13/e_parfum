import ProdItem from '../models/ProdItem.js'
import ProdVar from '../models/ProdVar.js'
import ProdOpt from '../models/ProdOpt.js'
import ProdConfig from '../models/ProdConfig.js'
import db from '../config/db.js'
import fs from 'fs/promises'

export default class ProdItemController {
    static getAllProdItem = async (req, res) => {
        try {
            const results = await ProdItem.findAll({
                include: [
                   {
                        model: ProdOpt,
                        as: 'product_variation_options',
                        through: { attributes: []},
                        include: [
                            {
                                model: ProdVar,
                                attributes: { exclude: ['createdAt', 'updatedAt']}
                            }
                        ]   
                   }
                ],
                attributes: { exclude: ['createdAt', 'updatedAt']}
            })
            if(results.length === 0) return res.status(404).json({ msg: 'product_item not found' })
            return res.status(200).json(results)
           
        } catch (error) {
            console.info(error.message)
        }
    }
    static getOneProdItem = async (req, res) => {
        const id = req.params.id
        try {
            const result = await ProdItem.findOne({
                where: {
                    id
                },
                include: [
                    {
                         model: ProdOpt,
                         as: 'product_variation_options',
                         through: { attributes: []},
                         include: [
                             {
                                 model: ProdVar,
                                 attributes: { exclude: ['createdAt', 'updatedAt']}
                             }
                         ]   
                    }
                 ],
                 attributes: { exclude: ['createdAt', 'updatedAt']}
            })
            if(!result) return res.status(404).json({ msg: 'product_item not found' })
            return res.status(200).json(result.toJSON())
        } catch (error) {
            console.info(error.message)
        }
    }
    static createProdItem = async (req, res) => {
        const file = req.files.product_image
        const t = await db.transaction()
        if(!file) return res.status(400).json({ msg: 'roduct image not uploaded!'})
        const [ fileImage ] = file
        const { filename } = fileImage
        const fileProdItemUrl = `${req.protocol}://${req.get('host')}/images/products/${filename}`
        try {
            let { product_id, name, quantity, price, variationId, value_option } = req.body
            value_option = !Array.isArray(value_option) && value_option != undefined ? value_option.split() : value_option
            const prodItem = await ProdItem.create({
                product_id,
                name,
                quantity,
                price,
                product_image: fileProdItemUrl
            }, {
                transaction: t
            })  
            let valueProdConfig = []
            for(let i = 0; i < variationId.length; i++) {
                const dataProdOpt = await ProdOpt.findOne({
                    where: {
                        value: value_option[i]
                    }
                }, {
                    transaction: t
                })
                let prodOpt
                if(!dataProdOpt) {
                    prodOpt = await ProdOpt.create({
                        product_variation_id: variationId[i],
                        value: value_option[i]
                    }, {
                        transaction: t
                    })
                }
                const idOpt = !prodOpt ? dataProdOpt.toJSON().id : prodOpt.toJSON().id
                const prodConfig = await ProdConfig.create({
                    product_item_id: prodItem.toJSON().id,
                    variation_option_id: idOpt
                }, {
                    transaction: t
                })
                valueProdConfig.push(prodConfig.toJSON())
            }
            if(valueProdConfig.length >= 0) res.status(201).json({
                msg: 'product_item added successfully'
            })
            await t.commit()
        } catch (error) {
            if(error) {
                const pathImage = `./public/images/products/${filename}`
                fs.unlink(pathImage)
            }
            console.info(error.message)
            await t.rollback()
        }
    }
    static updateProdItem = async (req, res) => {
        const id = req.params.id
        const t = await db.transaction()
        const file = req.files?.product_image
        const dataProdItem = await ProdItem.findByPk(id)
        if(!dataProdItem) return res.status(404).json({ msg: 'product_item not found' })
        const { product_image } = dataProdItem.toJSON()
        const imageName = () => {
            const splitUrl = product_image.split('/')
            return splitUrl[splitUrl.length - 1]
        }
        let tempImage
        if(!file) {
            tempImage = imageName()
        }else {
            const pathImage = `./public/images/products/${imageName()}`
            fs.unlink(pathImage)
            const [ fileImage ] = file
            const { filename } = fileImage
            tempImage = filename
        }
        const fileProdItemUrl = `${req.protocol}://${req.get('host')}/images/products/${tempImage}`
        try {
            let { product_id, name, quantity, price, variationId, value_option } = req.body
            variationId = !variationId ? [] : variationId
            value_option = !Array.isArray(value_option) && value_option != undefined ? value_option.split() : value_option
            const [ prodItem ] = await ProdItem.update({
                product_id,
                name,
                quantity,
                price,
                product_image: fileProdItemUrl
            }, {
                where: { id }
            },{
                transaction: t
            })
            if(variationId && value_option) await ProdConfig.destroy({ 
                where: {
                    product_item_id: id
                }
            }, {
                transaction: t
            })
            let valueProdConfig = []
            for(let i = 0; i < variationId.length; i++) {
                const dataProdOpt = await ProdOpt.findOne({
                    where: {
                        value: value_option[i]
                    }
                }, {
                    transaction: t
                })
                let prodOpt
                if(!dataProdOpt) {
                    prodOpt = await ProdOpt.create({
                        product_variation_id: variationId[i],
                        value: value_option[i]
                    }, {
                        transaction: t
                    })
                }
                const idOpt = !prodOpt ? dataProdOpt.toJSON().id : prodOpt.toJSON().id
                const prodConfig = await ProdConfig.create({
                    product_item_id: id,
                    variation_option_id: idOpt
                }, {
                    transaction: t
                })
                valueProdConfig.push(prodConfig.toJSON())
            }
            if(valueProdConfig.length > 0 || prodItem > 0) res.status(200).json({ msg: 'product_item updated successfully' })
            t.commit()
        } catch (error) {
            if(error) {
                const [ fileImage ] = file
                const { filename } = fileImage
                const pathImage = `./public/images/products/${filename}`
                fs.unlink(pathImage)
            }
            console.info(error)
            t.rollback()
        }
    }
    static removeProdItem = async (req, res) => {
        const id = req.params.id
        const t = await db.transaction()
        const dataProdItem = await ProdItem.findByPk(id)
        if(!dataProdItem) return res.status(404).json({ msg: 'product_item not found' })
        const { product_image } = dataProdItem.toJSON()
        const splitUrl = product_image.split('/')
        const imageName = splitUrl[splitUrl.length - 1]
        const pathImage = `./public/images/products/${imageName}`
        fs.unlink(pathImage)
        try {
            await ProdConfig.destroy({
                where: {
                    id
                }
            }, {
                transaction: t
            })
            const response = await ProdItem.destroy({
                where: {
                    id
                }
            }, {
                transaction: t
            })
            if(response > 0) return res.status(200).json({ msg: 'product_item deleted successfully' })
        } catch (error) {
            console.info(error.message)
        }
    }
}
import ProdVar from '../models/ProdVar.js'
import ProdOpt from '../models/ProdOpt.js'


export default class ProdVarController {
    static getAllProdVar = async (req, res) => {
        try {
            const results = await ProdVar.findAll({
                include: [
                    {
                        model: ProdOpt,
                        as: 'product_variation_options'
                    }
                ],
                attributes: { exclude: ['createdAt', 'updatedAt']}
            })
            if(results.length === 0) return res.status(404).json({ msg: 'variation not found' })
            return res.status(200).json(results)
        } catch (error) {
            console.info(error.message)
        }
    }
    static getOneProdVar = async (req, res) => {
        const id = req.params.id
        try {
            const result= await ProdVar.findOne({ 
                where: { id },
                include: [
                    {
                        model: ProdOpt,
                        as: 'product_variation_options'
                    }
                ],
                attributes: { exclude: ['createdAt', 'updatedAt']}
            })
            if(!result) return res.status(404).json({ msg: 'variation not found' })
            return res.status(200).json(result)
        } catch (error) {
            console.info(error.message)
        }
    }   
    static createProdVar = async (req, res) => {
        const { name } = req.body
        try {
            const response = await ProdVar.create({
                name
            }) 
            if(response) return res.status(201).json({ msg: 'variation added successfully' })
        } catch (error) {
            console.error(error.message)
        }
    }
    static updateProdVar = async (req, res) => {
        const id = req.params.id
        const { name } = req.body
        try {
            const dataProdVar= await ProdVar.findByPk(id)
            if(!dataProdVar) return res.status(404).json({ msg: 'variation not found' })
            const [ response ] = await ProdVar.update({
                name
            }, {
                where: { id }
            })
            if(response > 0) return res.status(200).json({ msg: 'variation updated successfully' })
        } catch (error) {
            console.info(error.message)
        }
    }
    static removeProdVar = async (req, res) => {
        const id = req.params.id
        try {
            const dataProdVar = await ProdVar.findByPk(id)
            if(!dataProdVar) return res.status(404).json({ msg: 'variation not found' })
            const response = await ProdVar.destroy({ where: { id }})
            if(response > 0) return res.status(200).json({ msg: 'variation removed successfully' })
        } catch (error) {
            console.info(error.message)
        }
    }
}
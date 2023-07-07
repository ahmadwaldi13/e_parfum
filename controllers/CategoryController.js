import Category from '../models/Category.js'

export default class CategoryController {
    static getAllCategory = async (req, res) => {
        try {
            const categories = await Category.findAll()
            if(categories.length === 0) return res.status(404).json({ msg: 'Category not found' })
            return res.status(200).json(categories)
        } catch (error) {
            console.error(error.message)
        }
    }
    static getOneCategory = async (req, res) => {
        const id = req.params.id
        try {
            const result = await Category.findByPk(id)
            if(!result) return res.status(404).json({ msg: 'Category not found' })
            const { dataValues } = result
            return res.status(200).json(dataValues)
        } catch (error) {
            console.info(error.message)
        }
    }
    static createCategory = async (req, res) => {
        const { category_name } = req.body
        try {
            const response = await Category.create({
                category_name
            })
            if(response) return res.status(201).json({ msg: 'category added successfully' })
        } catch (error) {
            console.info(error.message)
        }
    }
    static updateCategory = async (req, res) => {
        const { category_name } = req.body
        const id = req.params.id
        try {
            const [ response ] = await Category.update({category_name}, {
                where: {
                    id
                }
            })
            if(response > 0) return res.status(200).json({ msg: 'Category updated successfully' })
        } catch (error) {
            console.info(error.message)
        }
    }
    static removeCategory = async (req, res) => {
        const id = req.params.id
        try {
            const response = await Category.destroy({ where: { id }})
            if(response > 0) return res.status(200).json({ msg: 'Category removed successfully' })
        } catch (error) {
            console.info(error.message)
        }
    } 
}
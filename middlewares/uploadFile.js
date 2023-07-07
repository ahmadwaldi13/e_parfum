import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let { fieldname } = file
        if(fieldname === 'profile_image') {
            cb(null, './public/images/profiles')
        }else if(fieldname == 'product_image'){
            cb(null, './public/images/products')
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})
const fileFilter = (req, file, cb) => {
    const allowTypes = ['.png', '.jpg', '.jpeg']
    const extname = allowTypes.includes(path.extname(file.originalname.toLowerCase()))

    if(extname) {
        return cb(null, true)
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
}
const limits = {
    fileSize: 4000000,
    file: 1
}
const uploadMiddelware = async (req, res, next) => {
    const upload =  multer({ storage, limits, fileFilter}).fields([{ name: 'profile_image', maxCount: 1 }, { name: 'product_image', maxCount: 1}])
    upload(req, res, err => {
        if(err instanceof multer.MulterError) { 
            res.status(400).json({ msg : err.message })
        }else if(err) {
            res.status(400).json({ msg : err.message })
        }
        next()
    })
}

export default uploadMiddelware
import express from 'express'
import router from './routes/index.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import db from './config/db.js'
import morgan from 'morgan'
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import Order from './models/Order.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PORT = 3000

try {
    db.authenticate()
    console.info('connected to database')
    // await Order.sync({ alter: true })
} catch (error) {
    console.info('error connecting to database')
    console.info(error)
}

app.use(express.static('public'))
app.set('views', './views/')
app.set('view engine', 'ejs')
app.use('/images', express.static(`${__dirname}/public/images`))
app.use('/css', express.static(`${__dirname}/public/css`))
app.use('/js', express.static(`${__dirname}/public/js`))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use('/', router)

app.listen(PORT, () => console.info(`listening on http://localhost:${PORT}`))


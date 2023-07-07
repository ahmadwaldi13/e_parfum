import { verify  } from 'jsonwebtoken'

export const verfyUser = async (req, res, next) => {
    const token = req.cookies['authorization']
    if(!token) return res.sendStatus(401)
    try {
        const authToken = await verify(token, process.env.ACCESS_TOKEN)
        if(!authToken) return res.sendStatus(403)
        req.dataUser = authToken
        next() 
    } catch (error) {
        console.info(error.message)
    }
}
export const adminOnly = (req, res, next) => {
    let role = req.dataUser.role
    role = role === 'admin' ? next() : res.sendStatus(403)
}

export const userOnly = (req, res, next) => {
    let role = req.dataUser.role
    role = role === 'user' ? next() : res.sendStatus(403)
}
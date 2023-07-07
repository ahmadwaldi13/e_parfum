import nodemailer from 'nodemailer';
import { config } from 'dotenv'
config()

const sendMail = async dataMail => {
    const { email, username, userId, token, subject } = dataMail
    try {
        const transporter = nodemailer.createTransport({
            host: process.env._HOST,
            port: 587,
            service: process.env._SERVICE,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env._USER,
                pass: process.env._PASS
            }
        })
        const message = {
            from: `FashCode < ${process.env.USER} >`,
            to: email,
            subject: subject,
            html: `
                <h3>Hi ${username}!</h3>
                <p>To activate your account, please click on the link below to verify your email address.</p>
                <p>${process.env._CLIENT_URL}/verify/${userId}/${token}</p>
            `
        }
        return await transporter.sendMail(message)
    } catch (error) {
        console.info(error.message)
    }
}
export default sendMail
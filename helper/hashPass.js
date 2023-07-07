import bcrypt from 'bcrypt'

export const hashPass = async (userPass) => {
    const saltRounds = 10
    const hash = await bcrypt.hash(userPass, saltRounds)
    return hash
}
export const comparePass = async (userPass, hashedPass) => {
    const match = bcrypt.compare(userPass, hashedPass)
    return match
}
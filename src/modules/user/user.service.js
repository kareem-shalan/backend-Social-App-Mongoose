import UserModel from "../../db/models/User.model.js"
import bcrypt from 'bcryptjs'


export const signup = async (req, res, next) => {
    const { name, email, password, phone, age } = req.body
    const user = await UserModel.findOne({ email })
    if (user) {
        return res.status(409).json({ data: { message: 'User already exists' } })
    }
    const newUser = await UserModel.create({ name, email, password, phone, age })
    const userResponse = newUser.toJSON()
    delete userResponse.password
    const token = await newUser.generateToken()
    res.status(201).json({ data: { message: 'User created successfully', user: userResponse, token: token } })

}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ data: { message: 'Invalid credentials' } })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ data: { message: 'Invalid credentials' } })
        }
        const token = await user.generateToken()
        const userResponse = user.toJSON()
        delete userResponse.password

        res.status(200).json({ data: { message: 'Login successful', user: userResponse, token: token } })
    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })
    }

}


export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.userId
        console.log(userId, "userId");

        const deletedUser = await UserModel.findByIdAndDelete(userId)

        if (!deletedUser) {
            return res.status(404).json({ data: { message: 'User not found' } })
        }

        const userResponse = deletedUser.toJSON()
        delete userResponse.password


        res.status(200).json({
            data: { message: 'User deleted successfully', user: userResponse }
        })
    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })
    }
}
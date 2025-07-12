import { model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: {
        type: Number,
        required: true,
        min: [18, 'Age must be at least 18'],
        max: [60, 'Age must be at most 60'],
    }
}, {

    optimisticConcurrency: true
})

// Fix: Use regular function instead of arrow function
userSchema.pre("save", async function (next) {
    if (!this.isModified('password') && !this.isModified('phone')) {
        console.log("password is not modified")
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    this.phone = await bcrypt.hash(this.phone, salt) 
    next()
})

userSchema.methods.generateToken = function () {
    return jwt.sign(
        { userId: this.id, email: this.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    )
}

const UserModel = model("user", userSchema)
export default UserModel    
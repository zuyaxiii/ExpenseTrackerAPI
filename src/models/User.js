import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
}, {
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt' 
    }
});

UserSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.checkPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateAuthToken = function () {

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
        { _id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: '2h' }
    );
    return token;
};

UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

UserSchema.statics.findUserAndPass = async function (username, password) {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }
    const user = await this.findOne({ username }).select('+password');
    if (!user) {
        throw new Error('Username or Password is incorrect');
    }
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
        throw new Error('Username or Password is incorrect');
    }
    return user;
};

const User = mongoose.model('User', UserSchema);

export default User;

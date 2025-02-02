import User from "../models/User.js";
import { validatePassword, validateUsername } from "../utils/validation.js";
import mongoose from "mongoose";

const userService = {
    createUser: async (username, password) => {
        validateUsername(username);
        validatePassword(password);

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const user = new User({ username, password });
        await user.save();
        return user;
    },

    updateUser: async (id, updates) => {
        const user = await User.findById(id).select('+password');
    
        if (!user) {
            throw new Error('User not found');
        }
    
        if (updates.password) {
            validatePassword(updates.password);
            user.password = updates.password;
        }
    
        if (updates.username) {
            validateUsername(updates.username);
            const existingUser = await User.findOne({ 
                username: updates.username,
                _id: { $ne: id }
            });
            if (existingUser) {
                throw new Error('Username already exists');
            }
            user.username = updates.username;
        }

        await user.save();
        return user;
    },

    loginUser: async (username, password) => {
        const user = await User.findUserAndPass(username, password);
        const token = user.generateAuthToken();

        return { user, token };
    },

    getAllUsers: async () => {
        const users = await User.find();
        if (users.length === 0) {
            throw new Error('No users found');
        }
        return users;
    },

    getUserbyId: async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID');
        }
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    deleteUser: async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID');
        }
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
};

export default userService;
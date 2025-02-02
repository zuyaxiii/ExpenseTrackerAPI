import userService from "../services/userService.js";

const userController = {
    registerUser: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await userService.createUser(username, password);
            res.status(201).json({ user: user.toJSON() });
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },

    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;
            const { user, token } = await userService.loginUser(username, password);
            res.status(200).json({ user: user.toJSON(), token });
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },

    getAllUsers : async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json({ users: users.map(user => user.toJSON()) });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await userService.getUserbyId(req.params.id);
            res.status(200).json({ user: user.toJSON() });
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
    
            console.log("Received updates:", updates);
    
            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: "No updates provided" });
            }
    
            const user = await userService.updateUser(id, updates);
    
            const userObject = user.toObject();
            delete userObject.password;
    
            res.status(200).json({ user: userObject });
        } catch (err) {
            console.error(" Error updating user:", err.message);
            res.status(400).json({ error: err.message });
        }
    },
    
    deleteUser: async (req, res) => {
        try {
            const user = await userService.deleteUser(req.params.id);
            res.status(200).json({ message: 'User deleted successfully', user: user.toJSON() });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

export default userController
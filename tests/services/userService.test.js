import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import userService from '../../src/services/userService.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('User Service', () => {
    let userData;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        userData = { username: 'testuser', password: 'Test1234' };
    });

    // CREATE USER
    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            const user = await userService.createUser(userData.username, userData.password);

            expect(user).toBeDefined();
            expect(user.username).toBe(userData.username);
            expect(user.password).not.toBe(userData.password);
        });

        it('should throw error if username already exists', async () => {
            await userService.createUser(userData.username, userData.password);
            await expect(userService.createUser(userData.username, userData.password))
                .rejects.toThrow('Username already exists');
        });
    });

    // LOGIN USER
    describe('loginUser', () => {
        it('should login successfully with correct credentials', async () => {
            await userService.createUser(userData.username, userData.password);
            const { user, token } = await userService.loginUser(userData.username, userData.password);

            expect(user).toBeDefined();
            expect(token).toBeDefined();
            expect(user.username).toBe(userData.username);
        });

        it('should throw error with incorrect password', async () => {
            await userService.createUser(userData.username, userData.password);
            await expect(userService.loginUser(userData.username, 'wrongpassword'))
                .rejects.toThrow('Username or Password is incorrect');
        });
    });

    // UPDATE USER
    describe('updateUser', () => {
        let user;

        beforeEach(async () => {
            user = await userService.createUser(userData.username, userData.password);
        });

        it('should update username successfully', async () => {
            const updatedUser = await userService.updateUser(user._id, { username: 'newusername' });
            expect(updatedUser.username).toBe('newusername');
        });

        it('should update password successfully', async () => {
            const updatedUser = await userService.updateUser(user._id, { password: 'NewTest1234' });
            const loginResult = await userService.loginUser(user.username, 'NewTest1234');
            expect(loginResult.user._id.toString()).toBe(user._id.toString());
        });

        it('should throw error when updating to existing username', async () => {
            await userService.createUser('existinguser', 'Test1234');
            await expect(userService.updateUser(user._id, { username: 'existinguser' }))
                .rejects.toThrow('Username already exists');
        });
    });

    // DELETE USER
    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            const user = await userService.createUser(userData.username, userData.password);
            const deleteResult = await userService.deleteUser(user._id);

            expect(deleteResult).toBeTruthy();
            const deletedUser = await User.findById(user._id);
            expect(deletedUser).toBeNull();
        });
    });
});

const express = require("express");
const bcrypt = require("bcrypt");
const User = require('../Model/user');

const user_router = express.Router();

// Route đăng ký người dùng
user_router.post('/register', async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });

        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong during registration' });
    }
});

// Route đăng nhập người dùng
user_router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).json("User not found");
        
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return res.status(401).json("Wrong password");

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong during login' });
    }
});

// Route lấy danh sách người dùng
user_router.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Route xóa người dùng theo ID
user_router.delete('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = user_router;

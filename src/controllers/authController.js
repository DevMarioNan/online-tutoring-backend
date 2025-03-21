const { z } = require('zod');
const { registerUser, loginUser } = require('../services/userService');

const registerSchema = z.object({
    full_name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    password_confirmation: z.string().min(6),
    phone_number: z.string().optional(),
    profile_picture_url: z.string().url().optional(),
    bio: z.string().optional(),
    role: z.enum(['STUDENT', 'TEACHER']),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const register = async (req, res) => {
    try {
        const userData = registerSchema.parse(req.body);
        const result = await registerUser(userData);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const loginData = loginSchema.parse(req.body);
        const result = await loginUser(loginData.email, loginData.password);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { register, login };

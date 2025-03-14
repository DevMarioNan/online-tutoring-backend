const { z } = require('zod');
const { registerUser, loginUser } = require('../services/userService');

const register = async (req, res) => {
    const registerSchema = z.object({
        full_name: z.string(),
        email: z.string(),
        password: z.string(),
        password_confirmation: z.string(),
        phone_number: z.string().optional(),
        profile_picture_url: z.string().optional(),
        bio: z.string().optional(),
    });

    try {
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "Invalid input", errors: validation.error.errors });
        }

        if (validation.data.password !== validation.data.password_confirmation) {
            return res.status(400).json({ message: "Password doesn't match the confirmation!" });
        }

        const result = await registerUser(validation.data);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const loginSchema = z.object({
        email: z.string(),
        password: z.string(),
    });

    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "Invalid input!", errors: validation.error.errors });
        }

        const result = await loginUser(validation.data.email, validation.data.password);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = { register, login };

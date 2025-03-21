const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

//update this code to make it handle to types on authentication student and teacher

const registerUser = async (userData) => {
    const { full_name, email, password, password_confirmation, phone_number, profile_picture_url, bio, role } = userData;

    if (password !== password_confirmation) {
        throw new Error("Passwords do not match!");
    }

    if (!['STUDENT', 'TEACHER'].includes(role)) {
        throw new Error("Invalid role specified!");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("Email already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            full_name,
            email,
            password_hash: hashedPassword,
            phone_number,
            profile_picture_url,
            bio,
            role,
        },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return { message: "User created successfully!", token };
};

const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Credentials provided are wrong!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error("The credentials provided are wrong. Please try again!");
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return { message: "Logged in successfully!", token };
};

module.exports = { registerUser, loginUser };

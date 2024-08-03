import express from 'express'
import bcrypt from 'bcrypt'

import { User } from '../models/Users.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'



const router = express.Router();
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email })
    if (user) {
        return res.json({ message: "user already existed" })
    }

    const hashpassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashpassword,

    })
    await newUser.save()
    return res.json({ status: true, message: "record registered" })
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return res.json({ message: "user is not registered" })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.json({ message: "password is incorrect" })
    }

    const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '48hr' })
    res.cookie('token', token, { httpOnly: true, maxAge: 360000 })
    return res.json({ status: true, message: "login successfully" })
})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: 'user not registered' })
        }
        const token = jwt.sign({ email: user.email }, process.env.KEY, { expiresIn: '10m' });
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mdashiqueali71@gmail.com',
                pass: 'qwat sbih fwic pric'
            }
        });

        var mailOptions = {
            from: email,
            to: 'mdashiqueali71@gmail.com',
            subject: 'Reset Password',
            text: `http://localhost:5173/resetPassword/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Error sending email" });

            } else {
                console.log("Email sent:", info.response);
                return res.json({ status: true, message: "email sent" })
            }
        });
    } catch (err) {
        console.log("Error in forgot password:", error)
        return res.status(500).json({ message: "Internal server error" });
    }
})

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const email = decoded.email; // Change 'id' to 'email' here
        const user = await User.findOne({ email }); // Find user by email
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        // Update user's password
        await User.findByIdAndUpdate(user._id, { password: hashPassword });
        return res.json({ status: true, message: "Updated password successfully" });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Invalid token or error occurred" });
    }
});

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Assuming you're using cookies to store the token
        if (!token) {
            return res.status(401).json({ status: false, message: "No token present" });
        }
        const decoded = await jwt.verify(token, process.env.KEY);
        next(); // Proceed to the next middleware
    } catch (err) {
        // Handle token verification errors
        console.error("Error verifying token:", err);
        return res.status(401).json({ status: false, message: "Invalid token" });
    }
}
router.get('/verify', verifyUser, (req, res) => {
    return res.json({ status: true, message: "authotized" })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({ status: true })
})
export { router as UserRouter }
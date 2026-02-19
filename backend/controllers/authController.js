const User = require("../modals/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
};

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Registration failed  or user exist"
            });
        }

        //secure password
        let hashedPassword = await bcrypt.hash(password, 10);


        user = await User.create({ email, password: hashedPassword });


        res.status(201).json({
            _id: user.id,
            email: user.email,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({
                message: "Email not registered"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        return res.json({
            _id: existingUser.id,
            email: existingUser.email,
            token: generateToken(existingUser.id),
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
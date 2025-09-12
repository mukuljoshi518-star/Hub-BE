const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op } = require('sequelize');

// Secret key for JWT (store this securely in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Login or Register

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with that email or username.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
console.log('Plain Password:', password);
        return res.status(201).json({
            message: 'User registered successfully.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                // password: hashedPassword,
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


const loginUser = async (req, res) => {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
        return res.status(400).json({ message: 'Username or email and password are required.' });
    }

    try {
        // Find the user by email or username
        let user = await User.findOne({ 
            where: { 
                [Op.or]: [{ email: email }, { username: username }] 
            },
            attributes: ['id', 'username', 'email', 'password'] // Ensure password is included
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        console.log("Entered password:", password);
console.log("Stored hashed password:", user.password);

        // Compare the input password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};



// Get a single user by ID
const getUser = async (req, res) => {
    const { id } = req.params;
    console.log('User ID:', id);

    if (!id) {
        return res.status(400).json({ message: 'ID is required.' });
    }

    try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: 'No user found.', user: null });
        }

        const { password, ...userDetails } = user.dataValues;
        return res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { ...updateFields } = req.body; 

    if (!id) {
        return res.status(400).json({ message: 'ID is required.' });
    }

    try {
        // Update user
        const [rowsUpdated] = await User.update(updateFields, { where: { id } });

        if (rowsUpdated === 0) {
            return res.status(404).json({ message: 'User not found or no changes made.' });
        }

        // Fetch the updated user
        const updatedUser = await User.findOne({ where: { id }, attributes: { exclude: ['password'] } });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found after update.' });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        if (users.length === 0) {
            return res.status(200).json({
                message: 'No users found.',
                users: []
            });
        }

        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = { loginUser,registerUser, getUser, getAllUsers, verifyToken,updateUser };



// Login or Register
// const login = async (req, res) => {
//     const { username, email, password } = req.body;
//     console.log('req.body:', req.body);

//     if (!username || !email || !password) {
//         return res.status(400).json({ message: 'All fields are required.' });
//     }

//     try {
//         // Check if the user exists
//         let user = await User.findOne({ where: { email } });

//         if (!user) {
//             // Create new user if not exists
//             const hashedPassword = await bcrypt.hash(password, 10);

//             user = await User.create({ username, email, password: hashedPassword });
//             console.log('New user created:', username);
//         } else {
//             // Check if the password is correct
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (!isMatch) {
//                 return res.status(401).json({ message: 'Invalid credentials.' });
//             }
//         }

//         // Generate a token
//         const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

//         // Respond with success message and token
//         res.status(200).json({
//             message: 'Login successful.',
//             token,
//             user: {
//                 id: user.id,
//                 username: user.username,
//                 email: user.email
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Server error' });
//     }
// };

// const signUpUser = async (req, res) => {
//     try {
//         // Extract user data from the request body
//         const { username, email, password } = req.body;
// console.log('reqbody>>>>>',req.body)
//         // Basic validation
//         if (!username || !email || !password) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Check if the email is already registered
//         const existingUser = await User.findOne({where : { email }});
//         if (existingUser) {
//             return res.status(400).json({ message: 'Email is already in use' });
//         }

//         // Hash the password
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Create a new user instance
//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword,
//         });

//         // Save the user to the database
//         await newUser.save();

//         // Respond with success
//         res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };
const User = require('../models/User')
const Message = require('../models/Message')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
// route GET
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
     if (!users?.length) {
        return res.status(400).json({ message: 'No users found'})
     }
     res.json(users)
})
// route POST
const createUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // Confirm data
    if(!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: 'All fields are required'})
    }

    // Check for duplicate users 
    const dupe = await User.findOne({ username }).lean().exec()
    if (dupe) {
        return res.status(409).json({message: 'Username already taken'})
    }

    // Hash the pass
    const hashedPass = await bcrypt.hash(password, 10)

    const userObject = { username, "password": hashedPass, roles}

    // Make the user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created successfully`})
    } else {
        res.status(400).json({ message: 'Invaild user data'})
    }
})
// route PATCH
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, password } = req.body

    if (!id || !username || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: 'All fields are required'})
    }

    const user = await User.findById(id).exec

    if (!user) {
        return res.status(400).json({message: "User doesn't exsist"})
    }

    const dupe = await User.findOne({ username }).lean().exec()
    // Allow updates to OG user
    if (dupe && dupe?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate username'})
    }

    user.username = username
    user.roles = roles

    if (password) {
        const hashedPass = await bcrypt.hash(password, 10)
        user.password = hashedPass
    }
    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} has been updated.`})
})
// route DELETE
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required'})
    }

    const user = await User.findById(id).exec()

    if (!user){
        return res.status(400).json({message: 'User not found.'})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with id ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}
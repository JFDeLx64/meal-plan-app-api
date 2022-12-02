const User = require('./User');
const bcrypt = require('bcryptjs');

// @desc Get all users
// @route GET /api/users
// @access Private
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').lean()
    // check if we have users
    if (!users?.length) {
      return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error'})
  }
}

// @desc Get a user by id
// @route GET /api/users/:id
// @access Private
const getUserByID = async (req, res) => {
  try {
    const { id } = req.body
    // confirm data
    if (!id) {
      return res.status(400).json({ message: 'Please provide user ID.'})
    }
    // check if user exists
    const user = await User.findById(id).select('-password').exec()
    
    if (!user) {
      return res.status(400).json({ message: 'User not found.'})
    }
    
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error'})
  }
}

// @desc Create a user
// @route POST /users
// @access Private
const createUser = async (req, res) => {
  const { email, password, roles} = req.body
  
  // confirm data
  if (!email || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'Please provide all required fields.'})
  }

  // check if email already exists
  const emailExists = await User.findOne({ email }).lean().exec()
  if (emailExists) {
    return res.status(409).json({ message: 'Email already exists.'})
  }

  // hash password 10 salt rounds
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create and store new user
  const userObject = { 
    email,
    password: hashedPassword,
    roles
  }

  const user = await User.create(userObject)
  // check if user was created
  if (user) {
    res.status(201).json({ message: `User ${email} created.`})
  } else {
    res.status(400).json({ message: 'Invalid user data.'})
  }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, email, password, roles, active } = req.body
  // confirm data
  if (!id || !email || !password || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    return res.status(400).json({ message: 'Please provide all required fields.'})
  }
  // check if user exists
  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(400).json({ message: 'User not found.'})
  }

  // check for duplicate
  const duplicate = await User.findOne({ email }).lean().exec()
  // Updates to the same email are allowed
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Email already exists.'})  
  }

  user.email = email
  user.roles = roles
  user.active = active

  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await user.save()

  res.json({message:`User ${updatedUser.email} updated.`})
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body

  // validate data
  if (!id) {
    return res.status(400).json({ message: 'Please provide a user id.'})
  }

  // check if user exists
  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found.'})
  }

  // delete user
  const result = await user.deleteOne()

  const reply = `User ${user.email} with ID ${result.id} has been deleted.`

  res.json({ message: reply })

}

module.exports = {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser
}
const bcrypt = require('bcrypt')
const User = require('../models/user')
const PASSWD_LEN = require('../utils/config').PASSWD_LENGTH


const createUser = async (req, res) => {
  const {
    name,
    companyName,
    email,
    password,
    phone,
    address,
    postalCode,
    city,
    legalFormOfCompany,
    businessIdentityCode,
    role
  } = req.body

  if ( !email|| !password )
    return res.status(400).json({ error: 'username or password is missing' })

  if ( password.length < PASSWD_LEN )
    return res.status(400).json({ error: 'password is too short' })

  const saltRound = 10
  const passwordHash = await bcrypt.hash(password, saltRound)

  const user = new User(
    {
      name,
      companyName,
      email,
      passwordHash,
      phone,
      address,
      postalCode,
      city,
      legalFormOfCompany,
      businessIdentityCode,
      role
    }
  )

  const savedNewUser = await user.save()
  res.status(201).json(savedNewUser)
}

const getAllUsers = async (req, res) => {
  if (req.user && req.user.role == 'admin') {
    const users = await User.find({})
    res.json(users)
  } else {
    res.status(401).json({ error: 'Unauthorized permission'})
  }
}

const getUserById = async (req, res) => {
  if (req.user.id.toString() == req.params.id) {
    const user = await User.findById(req.params.id)
    if (user)
      res.json(user)
    else
      res.status(404).end()
  } else {
    res.status(401).json({ error: 'permission denied'})
  }
}

const updateUser = async (req, res) => {
  const {
    newName,
    currentPassword,
    newPassword,
    newAddress,
    newLegalFormOfCompany,
    newBusinessIdentityCode
  } = req.body
  const userToUpdate = await User.findById(req.params.id)

  if ( !userToUpdate )
    return res.status(404).json({ error: 'user not found'})

  // Only user itself can update it's data
  if ( req.user.id.toString() !== userToUpdate.id.toString() )
    return res.status(403).json({ error: 'permission denied' })

  if ( newPassword) {
    if ( newPassword.length < PASSWD_LEN )
      return res.status(400).json({ error: 'new password is too short' })

    const passwordIsCorrect = await bcrypt
      .compare(
        currentPassword,
        userToUpdate.passwordHash
      )
    if ( !passwordIsCorrect)
      return res.status(400).json({ error: 'invalid password' })

    if (currentPassword === newPassword)
      return res.status(400).json({ error: 'new password can\'t same as old password'  })

    const saltRound = 10
    userToUpdate.passwordHash = await bcrypt.hash( newPassword, saltRound )
  }

  // if new data is given
  if (newName) userToUpdate.name = newName
  if (newAddress) userToUpdate.newAddress = newAddress
  if (newLegalFormOfCompany) userToUpdate.legalFormOfCompany = newLegalFormOfCompany
  if (newBusinessIdentityCode) userToUpdate.businessIdentityCode = newBusinessIdentityCode

  const updatedUser = await userToUpdate.save()
  res.json(updatedUser)
}

const deleteUser = async (req, res) => {
  const userFromParams = req.params.id
  if (req.user.id.toString() !== userFromParams )
    return res.status(403).json({ error: 'permission denied' })

  await User.findByIdAndDelete( userFromParams ) 
  res.status(204).end()

}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
}



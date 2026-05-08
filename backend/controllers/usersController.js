const bcrypt = require('bcrypt');
const User = require('../models/user');
const PASSWD_LEN = require('../utils/config').PASSWD_LENGTH || 8;

const createUser = async (request, response) => {
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
    role,
  } = request.body;

  if (!email || !password) return response.status(400).json({ error: 'email or password is missing' });

  if (password.length < PASSWD_LEN)
    return response.status(400).json({ error: `Salasana on liian lyhyt, vähimmäispituus on ${PASSWD_LEN}` });

  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);

  const user = new User({
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
    role,
  });

  const savedNewUser = await user.save();
  response.status(201).json(savedNewUser);
};

const getAllUsers = async (request, response) => {
  if (request.user && (request.user.role === 'admin' || request.user.role === 'viewer')) {
    const users = await User.find({});
    response.json(users);
  } else {
    response.status(401).json({ error: 'Unauthorized permission' });
  }
};

const getUserById = async (request, response) => {
  if (request.user.id.toString() === request.params.id
    || request.user.role === 'admin'
    || request.user.role === 'viewer') {

    const user = await User.findById(request.params.id)
      .populate('answers', {
        moduleId: 1,
        sectionId: 1,
        questionId: 1,
        answer: 1,
        groupAnswers: 1,
        type: 1,
        createdAt: 1,
        updatedAt: 1
      })
    if (user)
      response.json(user);
    else
      response.status(404).end();
  } else {
    response.status(401).json({ error: 'permission denied' });
  }
};

const updateUser = async (request, response) => {
  const {
    newName,
    currentPassword,
    newPhone,
    newPassword,
    newAddress,
    newPostalCode,
    newCity,
    newRole
  } = request.body;

  const userToUpdate = await User.findById(request.params.id);

  if (!userToUpdate)
    return response.status(404).json({ error: 'User not found' });

  const user = request.user
  // Only admin or user itself can update it's data
  if (user.role === 'viewer' ||
    (user.role !== 'admin' && user.id.toString() !== userToUpdate.id.toString()))
    return response.status(403).json({ error: 'Permission denied' });

  // AI Generated better error messages
  if (newPassword && newPassword.length < PASSWD_LEN)
    return response.status(400)
      .json({ error: `Uusi salasana on liian lyhyt, vähimmäispituus on ${PASSWD_LEN}` });

  if (newPassword) {
    const isUpdatingSelf = user.id.toString() === userToUpdate.id.toString();
    const isAdmin = user.role === 'admin';

    // Current password is required if user is updating their own password
    // Admin can update other users' passwords without current password
    // AI Generated better error messages
    if (isUpdatingSelf || !isAdmin) {
      if (!currentPassword)
        return response.status(400)
          .json({ error: 'Nykyinen salasana tarvitaan salasanan vaihtamiseksi' });

      // AI Generated better error messages
      const passwordIsCorrect = await bcrypt.compare(currentPassword, userToUpdate.passwordHash);
      if (!passwordIsCorrect)
        return response.status(400).json({ error: 'Nykyinen salasana on väärä' });

      // AI Generated better error messages
      if (currentPassword === newPassword)
        return response.status(400).json({
          error: 'Uuden salasanan on oltava eri kuin nykyinen salasana',
        });
    }

    const saltRound = 10;
    userToUpdate.passwordHash = await bcrypt.hash(newPassword, saltRound);
  }

  // if new data is given
  if (newName) userToUpdate.name = newName;
  if (newPhone) userToUpdate.phone = newPhone;
  if (newAddress) userToUpdate.address = newAddress;
  if (newPostalCode) userToUpdate.postalCode = newPostalCode;
  if (newCity) userToUpdate.city = newCity;
  if (user.role === 'admin' && newRole) userToUpdate.role = newRole;

  const updatedUser = await userToUpdate.save();
  response.json(updatedUser);
};

const deleteUser = async (request, response) => {
  const userFromParams = request.params.id;
  const user = request.user;
  const role = user.role;

  const userIsOwner = user.id.toString() === userFromParams;
  const roleIsAdmin = role === 'admin';

  // Only user itself or admin can delete
  if (!userIsOwner && !roleIsAdmin) return response.status(403).json({ error: 'permission denied' });

  // Admin cannot delete itself
  if (userIsOwner && roleIsAdmin)
    return response.status(403).json({ error: "Admin cannot delete it's own account" });

  await User.findByIdAndDelete(userFromParams);
  return response.status(204).end();
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

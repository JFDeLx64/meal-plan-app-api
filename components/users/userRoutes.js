const express = require('express')
const router = express.Router()
const usersController = require('./usersController')

router.route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

router.route('/:id')
  .get(usersController.getUserByID)

module.exports = router
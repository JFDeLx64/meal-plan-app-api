const express = require('express')
const router = express.Router()
const recipeController = require('../recipes/recipeController')

router.route('/')
  .get(recipeController.getAllRecipes)
  .get(recipeController.getRecipe)
  .post(recipeController.createRecipe)
  .patch(recipeController.updateRecipe)
  .delete(recipeController.deleteRecipe)

module.exports = router



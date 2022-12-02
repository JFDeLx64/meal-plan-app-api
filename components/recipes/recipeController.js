const Recipe = require('./Recipe')
const User = require('../users/User')

// @desc Get all recipes
// @route GET /api/recipes
// @access Private

const getAllRecipes = async (req, res) => {
  const recipes = await Recipe.find({}).lean()

  if (!recipes?.length) {
    return res.status(400).json({ message: 'No recipes found'})
  }

  // add user to each recipe
  recipesWithUser = await Promise.all(recipes.map(async (recipe) => {
    const user = await User.findById(recipe.user).lean().exec()
    return { ...recipe, user: user }
  }))

  res.json(recipesWithUser)
}

// @desc Get recipe by id
// @route GET /api/recipes/:id
// @access Private

const getRecipe = async (req, res) => {
  const { id } = req.params

  // confirm data is valid
  if (!id) {
    return res.status(400).json({ message: 'Please provide recipe ID.'})
  }

  // verify recipe exists
  const recipe = await Recipe.findById(id).exec()

  if (!recipe) {
    return res.status(400).json({message: 'Recipe not found'})
  }

  res.json(recipe)
}

// @desc Create a recipe
// @route POST /api/recipes
// @access Private

const createRecipe = async (req, res) => {
  const { title, cookTime, prepTime, description, image, ingredients, instructions, isFavorite, user } = req.body

  // confirm data
  if (!title || !cookTime || !prepTime || !description || !image || !ingredients || !instructions || !user) {
    return res.status(400).json({ message: 'All fields are required.' })
  }

  // create new recipe
  const recipe = await Recipe.create({
    title,
    cookTime,
    prepTime,
    description,
    image,
    ingredients,
    instructions,
    isFavorite,
    user
  })

  if (recipe) {
    return res.status(201).json({ message: 'Recipe created.' })
  } else {
    return res.status(400).json({ message: 'Recipe not created.' })
  }
}

// @desc Update a recipe
// @route PATCH /api/recipes/:id
// @access Private

const updateRecipe = async (req, res) => {
  const { id, title, cookTime, prepTime, description, image, ingredients, instructions, isFavorite, user } = req.body

  // confirm data
  if (!id || !title || !cookTime || !prepTime || !description || !image || !ingredients || !instructions || !user) {
    return res.status(400).json({ message: 'All fields are required.' })
  }

  // Confirm recipe exists
  const recipe = await Recipe.findById(id).exec()

  if (!recipe) {
    return res.status(400).json({ message: 'Recipe not found.' })
  }

  // update recipe
  recipe.user = user
  recipe.title = title
  recipe.cookTime = cookTime
  recipe.prepTime = prepTime
  recipe.description = description
  recipe.image = image
  recipe.ingredients = ingredients
  recipe.instructions = instructions
  recipe.isFavorite = isFavorite

  const updatedRecipe = await recipe.save()

  res.json(`Recipe ${updatedRecipe.title} updated.`)
}

// @desc Delete a recipe
// @route DELETE /api/recipes/:id
// @access Private

const deleteRecipe = async (req, res) => {
  const { id } = req.body

  // Confirm data
  if (!id) {
    return res.status(400).json({message: 'Recipe ID is required.'})
  }

  // Confirm recipe exists
  const recipe = await Recipe.findById(id).exec()

  if (!recipe) {
    return res.status(400).json({ message: 'Recipe not found.' })
  }

  // delete recipe
  const result = await recipe.deleteOne()

  const reply = `Recipe ${result.title} with ID: ${result._id} has been deleted.`

  res.json(reply)
}

module.exports = {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe
}




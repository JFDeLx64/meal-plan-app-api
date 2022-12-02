// Model for recipes in the database
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema( {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    cookTime: {
      type: String,
      required: true
    },
    prepTime: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    ingredients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
    }],
    instructions: {
      type: String,
      required: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  }, 
  {
    timestamps: true
  }
)

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
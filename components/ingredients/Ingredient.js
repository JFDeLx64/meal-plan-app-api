// Model for ingredients in the database
const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  }
);

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;    
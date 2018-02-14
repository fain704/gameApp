var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var CharacterSchema = new Schema({
  // `title` is required and of type String
  characterName: {
    type: String,
    required: true
  },
  attack: {
    type: Number,
    required: true
  },
  hitPoints: {
    type: Number,
    required: true
  },
  speed: {
    type: Number,
    required: true
  },
  range: {
    type: Number,
    required: true
  },

});

// This creates our model from the above schema, using mongoose's model method
var Character = mongoose.model("Character", CharacterSchema);

// Export the Article model
module.exports = Character;

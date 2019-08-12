// Liberearies Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Connecting to the MongoDB server
mongoose.connect("mongodb://localhost:27017/MoviesGraphqlApp", {
  useNewUrlParser: true
});

// Creating Event Schema
const movieSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Movie", movieSchema);

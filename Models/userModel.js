// Liberearies Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Connecting to the MongoDB server
mongoose.connect("mongodb://localhost:27017/MoviesGraphqlApp", {
  useNewUrlParser: true
});

// Creating User Schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  favouriteMovies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Movie"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);

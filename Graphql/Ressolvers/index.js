// Liberaries Imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models Imports
const Movie = require("../../Models/movieModel");
const User = require("../../Models/userModel");

const moviesMerge = async moviesId => {
  try {
    const movies = await Movie.find({ _id: { $in: moviesId } });
    movies.map(movie => {
      return {
        ...movie._doc,
        _id: movie.id,
        user: userMerge.bind(this, movie.user)
      };
    });
    return movies;
  } catch (err) {
    throw err;
  }
};

const userMerge = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      favouriteMovies: moviesMerge.bind(this, user._doc.favouriteMovies)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  movies: async () => {
    try {
      const movies = await Movie.find();
      return movies.map(movie => {
        return {
          ...movie._doc,
          _id: movie.id,
          user: userMerge.bind(this, movie._doc.user)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createMovie: (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    const movie = new Movie({
      name: args.movie.name,
      story: args.movie.story,
      rating: args.movie.rating,
      user: req.userId
    });
    let favouriteMovies;
    return movie
      .save()
      .then(result => {
        favouriteMovies = {
          ...result._doc,
          user: userMerge.bind(this, result._doc.user)
        };
        return User.findById(req.userId);
      })
      .then(user => {
        if (!user) {
          throw new Error("User not found");
        }
        user.favouriteMovies.push(movie);
        return user.save();
      })
      .then(result => {
        return favouriteMovies;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createUser: args => {
    return User.findOne({ email: args.user.email })
      .then(user => {
        if (user) {
          throw new Error("User already exists.");
        }
        return bcrypt.hash(args.user.password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email: args.user.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
        return { ...result._doc, password: null };
      })
      .catch(err => {
        throw err;
      });
  },
  login: async ({ email, password }) => {
    console.log(password);
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      throw new Error("User doesn't exist");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password isn't correct");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "themostsecuretextintheworld",
      { expiresIn: "2h" }
    );
    return { userId: user.id, token: token, tokenExpiration: 2 };
  }
};

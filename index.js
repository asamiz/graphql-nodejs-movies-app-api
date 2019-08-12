// Liberaries Imports
const express = require("express");
const graphqlHTTPClient = require("express-graphql");
const { buildSchema } = require("graphql");
const bcrypt = require("bcryptjs");

// Models Imports
const Movie = require("./Models/movieModel");
const User = require("./Models/userModel");

// Declaring the port to make the app listen on
const port = process.env.PORT || 3000;

const userMerge = async userId => {
  try {
    const user = await User.findById(userId);
    console.log(user);

    return {
      ...user._doc,
      _id: user.id
      // createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

// Initialize the app
const app = express();

// Parsing the body to be able to send and recieve as a JSON
app.use(express.json());

// *** Routes and middlewares ***

// Building the graphql middleware
app.use(
  "/api",
  graphqlHTTPClient({
    schema: buildSchema(`
      type Movie {
        _id: ID!
        name: String!
        story: String!
        rating: Float!
        user: User!
      }

      type User {
        _id: ID!
        email: String!
        password: String
        favouriteMovies: [Movie!]
      }
    
      type RootQuery {
        movies: [Movie!]!
      }

      type RootMutation {
        createMovie(movie: MovieInput): Movie
        createUser(user: UserInput): User
      }
      
      input MovieInput {
        name: String!
        story: String!
        rating: Float!
      }

      input UserInput {
        email: String!
        password: String!
      }

      schema {
        query: RootQuery
        mutation:RootMutation
      }
    `),
    rootValue: {
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
      createMovie: args => {
        const movie = new Movie({
          name: args.movie.name,
          story: args.movie.story,
          rating: args.movie.rating,
          user: "5d5142a1ad4b822244659f5c"
        });
        let favouriteMovies;
        return movie
          .save()
          .then(result => {
            favouriteMovies = { ...result._doc };
            return User.findById("5d5142a1ad4b822244659f5c");
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
      }
    },
    graphiql: true
  })
);
// Starting the server and
app.listen(port, () => {
  console.log(`>>>>> Server is running on PORT ${port} <<<<<<<`);
});

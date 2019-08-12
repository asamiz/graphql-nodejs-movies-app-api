const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Movie {
  _id: ID!
  name: String!
  story: String!
  rating: Float!
  user: User!
}

type authData { 
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

type User {
  _id: ID!
  email: String!
  password: String
  favouriteMovies: [Movie!]
}

type RootQuery {
  movies: [Movie!]!
  login(email: String!, password: String!): authData!
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
`);

// Liberaries Imports
const express = require("express");
const graphqlHTTPClient = require("express-graphql");

// Middlewares imports
const userAuth = require("./Middlewares/userAuthentication");

// Declaring the port to make the app listen on
const port = process.env.PORT || 3000;

// Graphql schema
const graphqlSchema = require("./Graphql/Schema/index");
// Graphql Ressolvers
const graphqlRessolvers = require("./Graphql/Ressolvers/index");

// Initialize the app
const app = express();

// Parsing the body to be able to send and recieve as a JSON
app.use(express.json());

// *** Routes and middlewares ***

// Authentication middleware
app.use(userAuth);

// Graphql middleware
app.use(
  "/api",
  graphqlHTTPClient({
    schema: graphqlSchema,
    rootValue: graphqlRessolvers,
    graphiql: true
  })
);
// Starting the server and
app.listen(port, () => {
  console.log(`>>>>> Server is running on PORT ${port} <<<<<<<`);
});

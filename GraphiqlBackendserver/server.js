const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const fs = require('fs');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const Book= require('./models/Book');
const Author= require('./models/Author');
const { verifyToken } = require('./src/verifyToken');
const console = require('console');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use(express.static('public'));

let aboutMessage = "graphiql clone";


const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize,
    parseValue(value) {
        return new Date(value);
        },
    parseLiteral(ast) {
        return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
        },
  });

  //serialize will convert  date to string
  function serialize(value) {
    return value.toISOString();
  }

const resolvers = {
    Query: {
      books,
      authors,
      authorByName,
      bookByTitle,
    },
    Book: {
      author,
    },
    Mutation: {
      setAboutMessage,
      addBook,
      addAuthor,

    },
    GraphQLDate,
};
async function author(books,_){

  const filter={bookId: books.bookId}

  const author = await Author.find(filter);
  console.log(filter);
  console.log(author);
  //return nestedBook.filter((post) => post.authorId === author.id);
  return author;
}
async function books(_, $ ){
  const filter = {};
  const books = await Book.find(filter);
  return books;
}
async function bookByTitle(_, title){
  const books = await Book.find(title);
  return books;
}
async function authorByName(_, author){
  const authors = await Author.find(author);
  //console.log(author);
  //console.log(authors);
  return authors;
}

async function authors(_,$,){
  const filter = {};
  const authors = await Author.find(filter);
  console.log(authors);
  return authors;
}

async function addBook(_, { book },) {
  const result = await Book.create(book);
  return result;
}


async function addAuthor(_, { author },) {
  const result = await Author.create(author);
  return result;
}

function setAboutMessage(_, { message }) {
   return aboutMessage = message;
  }




//Initialise Graphql server and returns Graphql server object
  const Aposerver = new ApolloServer({
      typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
      resolvers,
      context: async ({ req, ...rest }) =>{
        let isAutthenticated = false;
        let user=null;

        try {
          const authHeader= req.headers.authorization || "";
          if(authHeader){
            const token = authHeader.split(" ")[1];
            const payload = await verifyToken(token);
            isAutthenticated = payload && payload.sub ? true : false;

          }
        } catch ( error)  
         {
            console.error(error);
        }

        return {...rest, req, auth:{ user}} ;

      }
    });


    //Apollo server as middleware in Express
    Aposerver.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 5000;

const server= app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
   server.close(() => process.exit(1));
});
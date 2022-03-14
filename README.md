#Graphql-Clone

##Schema


##Queries: <br/>
{
  books{
    bookId,
    title,
    genre,
    publishedOn,
    author{
      name
      age
    }
  }
}

<br/>
{
  authors{
    authorId
    name
	age
    bookId
  
  }
}

<br/>

{
  bookByTitle(title:"The Dreamland"){
    genre
    publishedOn
  }
}

<br/>

  {
  books{
    bookId,
    title,
    genre,
    publishedOn,
    author{
      name
      age
    }
  }
}

<br/>
##Mutations  <br/>

mutation {
  addBook(book:{
    title: "Halloween",
    genre: "Horror"
    publishedOn: "2013-05-09"
  }){
    title
    genre
    publishedOn
  }
}

##Schema
type Book{
    bookId: Int!
    title: String!
    genre: String!
    publishedOn: GraphQLDate!
    author: [Author]!
}
<br/>
type Author{
    authorId: Int!
    name: String!
    age: Int!
    bookId: Int!
    
}

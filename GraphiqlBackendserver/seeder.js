const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Book = require('./models/Book');
const Author = require('./models/Author');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  // Read JSON files
  const book = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/books.json`, 'utf-8')
  );

  
  
  const author = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/authors.json`, 'utf-8')
  );

 

  // Import into DB
const importData = async () => {
    try {
      await Book.create(book);
      await Author.create(author);
      console.log('Data Imported...');
      process.exit();
    }catch (err) {
        console.error(err);
    }
}

// Delete data from db
const deleteData = async () => {
    try {
      await Book.deleteMany();
      await Author.deleteMany();
      console.log('Data Destroyed...');
      process.exit();
    } catch (err) {
      console.error(err);
    }
  };

if (process.argv[2] === '-i') {
    importData();
  } else if (process.argv[2] === '-d') {
    deleteData();
  }
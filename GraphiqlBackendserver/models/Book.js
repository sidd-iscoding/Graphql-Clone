const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({

    bookId:{
      type: Number,
      required: [true, 'Please add book Id']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add book name']
      },
      genre: {
        type: String,
        trim: true,
        required: [true, 'Please add  genre']
      },
      publishedOn: {
        type: Date,
        default: Date.now
      },
     
});

module.exports = mongoose.model('Book', BookSchema);
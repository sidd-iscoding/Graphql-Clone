const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({

    authorId:{
      type: Number,
      required: [true, 'Please add author Id']
    },
    name: {
        type: String,
        trim: true,
        required: [true, 'Please add Author name']
      },
      age: {
        type: Number,
        required: [true, 'Please add  age']
      },
      bookId:{
        type: Number,
        ref:'Book',
        required: [true, 'Please add book Id']
      },
      
});


module.exports = mongoose.model('Author', AuthorSchema);
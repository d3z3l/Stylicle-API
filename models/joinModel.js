const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const PersonSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'A user must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
      minlength: [1, 'A user name must have more or equal then 10 characters'],
      
      // validate: [validator.isAlpha, 'user name must only contain characters']
    },
    email: {
      type: String,
      required: [true, 'A user must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
      minlength: [10, 'A user name must have more or equal then 10 characters'],
      validate: {
        validator: function(val) {
          var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          // this only points to current doc on NEW document creation
          return regex.test(val);
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      },
      // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
      // validate: [validator.isAlpha, 'user name must only contain characters']
    },
    post:[{type: mongoose.Schema.Types.ObjectId ,ref:"posts"}]
  }
);




const persons = mongoose.model('persons', PersonSchema);

module.exports = persons;

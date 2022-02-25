
const mongoose = require('mongoose');


const NewsLetterSchema = mongoose.Schema({
  email: {
    type: String, lowercase: true, required: [true, 'email is required'], validate: [
      { validator: isEmail, message: val => "please enter a valid email", }
    ]
  },
  //symbol: {type:String, required:[true, 'NewsLetter symbol is required']}
}, {
  timestamps: true
});



module.exports.NewsLetterSchema = NewsLetterSchema

module.exports.NewsLetterModel = mongoose.model('NewsLetter', NewsLetterSchema);
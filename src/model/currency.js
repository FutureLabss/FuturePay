
const mongoose = require('mongoose');


const CurrencySchema = mongoose.Schema({
  name: { type: String, required: [true, 'A Name is required'] },
  type: { type: String, default: 'fiat', enum: ['fiat', 'crypto'] },
  isBase: { type: Boolean, default: false },
  toBase: { type: Number, required: [true, 'Exchange rate to base is required'] },
  //symbol: {type:String, required:[true, 'Currency symbol is required']}
}, {
  timestamps: true
});



module.exports.CurrencySchema = CurrencySchema

module.exports.CurrencyModel = mongoose.model('Currency', CurrencySchema);
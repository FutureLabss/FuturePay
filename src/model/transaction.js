

const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: [true, 'Account must be provided'] },
  proof: { type: String, },
  key: { type: String, },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: [true, 'From Currency must be specified'] },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: [true, 'To Currency must be specified'] },
  amount: { type: Number, required: [true, 'Amount is required '] },
  toReceive: { type: Number,  },
  paymentAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentAccount', required: [true, 'Payment Account must be provided'] },
  payment: { type: String, required: [true, 'Payment Mode is required '] },
  status: { type: String, default: 'pending', enum: ['successful', 'pending', 'paid', 'canceled'] },
  updated: { type: Date }
}, {
  timestamps: true  
});

const { PaginatePlugin } = require('../mixin/db/paginate')

TransactionSchema.plugin(PaginatePlugin)

module.exports.TransactionSchema = mongoose.model('Transaction', TransactionSchema);
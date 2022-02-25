


const mongoose = require('mongoose');


const WalletSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false },
  currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: [true, 'Wallet must specify a currency'], unique: false },
  balance: { type: Number, default: 0 },
  ledgerBalance: { type: Number, default: 0 },
}, {
  timestamps: true
});


const WalletDepositSchema = mongoose.Schema({
  key: { type: String, },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: [true, 'Currency must be specified'] },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: [true, 'Wallet must be specified'] },
  amount: { type: Number, required: [true, 'Amount is required '] },
  proof: { type: String, },
  toReceive: { type: Number },
  status: { type: String, default: 'pending', enum: ['successful', 'pending', 'paid', 'failed', 'cancled'] },
  approved: { type: Boolean, default: false },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});


const WalletFlutterDepositSchema = mongoose.Schema({
  key: { type: String, },
  txRef: { type: String, required: [true, 'TransactionRef is required'] },
  flwRef: { type: String, required: [true, 'Flutter wave Ref is required'] },
  txId: { type: String, required: [true, 'Transaction id is required'], unique: true, dropDups: true },
  currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: [true, 'Currency must be specified'] },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: [true, 'Wallet must be specified'] },
  amount: { type: Number, required: [true, 'Amount is required '] },
  chargedAmount: { type: Number, default: 0 },
  toReceive: { type: Number },
  status: { type: String, default: 'pending', enum: ['successful', 'pending', 'paid', 'failed', 'cancled'] },
  approved: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});


const WalletWithdrawSchema = mongoose.Schema({
  key: { type: String, },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: [true, 'Account must be specified'] },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: [true, 'Wallet must be specified'] },
  amount: { type: Number, required: [true, 'Amount is required '] },
  proof: { type: String, },
  toReceive: { type: Number },
  approved: { type: Boolean, default: false },
  status: { type: String, default: 'pending', enum: ['successful', 'pending', 'paid', 'failed', 'cancled'] },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});


const WalletTransferSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sendWallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: [true, 'Wallet must be specified'] },
  currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: [true, 'Currency must be specified'] },
  receiveWallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  amount: { type: Number, required: [true, 'Amount is required '] },
  toReceive: { type: Number },
  status: { type: String, default: 'pending', enum: ['successful', 'pending', 'paid', 'failed'] },
}, {
  timestamps: true
});



const { PaginatePlugin } = require('../mixin/db/paginate')

WalletDepositSchema.plugin(PaginatePlugin)
WalletTransferSchema.plugin(PaginatePlugin)
WalletWithdrawSchema.plugin(PaginatePlugin)
WalletFlutterDepositSchema.plugin(PaginatePlugin)

WalletSchema.index({ user: 1, currency: 1 }, { unique: true })

module.exports.WalletSchema = mongoose.model('Wallet', WalletSchema);
module.exports.WalletDepositSchema = mongoose.model('WalletDeposit', WalletDepositSchema);
module.exports.WalletWithdrawSchema = mongoose.model('WalletWithdraw', WalletWithdrawSchema);
module.exports.WalletTransferSchema = mongoose.model('WalletTransfer', WalletTransferSchema);
module.exports.WalletFlutterDepositSchema = mongoose.model('WalletFlutterDepositSchema', WalletFlutterDepositSchema);
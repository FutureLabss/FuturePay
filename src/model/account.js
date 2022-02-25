

const mongoose = require('mongoose');
const { PaginatePlugin } = require('../mixin/db/paginate');
const { CurrencySchema } = require('./currency');



const AccountSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    accountCurrency: { type: String, },
    currency: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: [true, ' Currency is required'] }],
    accountName: { type: String, required: [true, 'Account Name is required '] },
    bankNumber: { type: String, required: [true, 'Account Number is required '] },
    recipientBank: { type: String, required: [true, 'Bank Name is required '] },
    recipientCountry: { type: String, required: [true, 'Country is required '] },
    city: { type: String, required: [true, 'City is required'] }
}, {
    timestamps: true
});





const PaymentAccountSchema = mongoose.Schema({
    type: { type: String, default: 'bank', lowercase: true, enum: ['bank', 'crypto', 'web'] },
    currency: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: [true, 'Account Currency is required'] }],
    accountName: { type: String, required: [true, 'Account Name is required '] },
    charge: { type: Number, default: 0.00 },
    futureCharge: { type: Number, default: 0.00 },
    accountNo: { type: String, required: [true, 'Account Number is required '] },
    accountBank: { type: String, required: [true, 'Bank Name is required '] },
}, {
    timestamps: true
});



AccountSchema.plugin(PaginatePlugin)
PaymentAccountSchema.plugin(PaginatePlugin)

module.exports.AccountSchema = mongoose.model('Account', AccountSchema);
module.exports.PaymentAccountSchema = mongoose.model('PaymentAccount', PaymentAccountSchema);
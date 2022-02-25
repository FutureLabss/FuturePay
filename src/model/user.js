
const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isMobilePhone } = require('validator/lib/isMobilePhone');

const UserSchema = mongoose.Schema({
    fullname: { type: String, required: [true, 'Full Name is required'] },
    email: {
        type: String, lowercase: true, required: [true, 'Email is required'], validate: [
            { validator: isEmail, message: val => "please enter a valid email", }
        ]
    },
    phone: { type: String, validate: [
        { validator: isMobilePhone, message: val => "please enter a valid phone Number", }
    ] }, // required: [true, 'Phone is required '] },
    password: { type: String, required: [true, 'Password is required'] },
    avatar: { type: String, },
    location: { type: String },

    type: { type: Number, default: 0 },
    attempt: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    refreshToken: { type: String, },
    last_attempt: { type: Date },

}, {
    timestamps: true
});


const ResetToken = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    code: { type: Number, required: true },
    attempt: { type: Number, default: 0 },
    type: { type: String, default: 'password', enum: ['password'] },

}, { timestamps: true })


const { PaginatePlugin } = require('../mixin/db/paginate')

UserSchema.plugin(PaginatePlugin)


module.exports.UserSchema = mongoose.model('User', UserSchema);
module.exports.ResetTokenSchema = mongoose.model('ResetToken', ResetToken);
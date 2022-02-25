const { parseDBError } = require("../../mixin/dbErrorParser");
const { UserSchema, ResetTokenSchema } = require("../../model/user");
const { randomInt } = require('crypto')
const bcrypt = require('bcrypt');
const { sendMail } = require("../../../config/mail");



async function bruteForceCheck(user) {
  let result = false
  const maxTime = 5
  if (user.attempt < maxTime) { //max retry limit == 5
    result = true
  } else {
    const timeDiff = new Date() - (user.last_attempt ?? 0)
    const minutesPassed = Math.floor((timeDiff / 1000) / 60);
    if (minutesPassed >= maxTime) {
      result = true
    }
  }
  user.last_attempt = new Date()
  user.attempt += 1
  await user.save()
  return result
}


exports.signUp = async function (data) {
  return UserSchema.find({ email: data.email }).then(async (users) => {
    if (users.length) {
      return { error: 'email already exist' }
    }
    const user = UserSchema({ ...data })
    const error = user.validateSync()
    if (error) {
      throw error
    }

    const password = await bcrypt.hash(user.password, 5)
    user.password = password
    await user.save()
    return user
  }).catch((e) => {
    return { error: parseDBError(e) }
  })
}

exports.login = async function (data) {
  return UserSchema.findOne({ email: data.email })
    .select(['email', 'fullname', 'phone', 'last_attempt', 'attempt', 'password', 'refreshToken', 'isActive', 'type'])
    .then(async (user) => {
      if (!user) {
        return { error: 'User not found' }
      }
      if (!await bruteForceCheck(user)) {
        return { error: 'Too many attempts, Try again in five minutes' }
      }

      if (await bcrypt.compare(data.password, user.password)) {
        user.attempt = 0
        await user.save()
        return user
      }

      return { error: 'incorrect password' }
    }).catch((e) => {
      return { error: parseDBError(e) }
    })
}

exports.getUserFromRefreshToken = async function (token) {
  return await UserSchema.findOne({ refreshToken: token }).catch((e) => {
    return { error: parseDBError(e) }
  })
}


exports.logOut = async function (id) {
  try {
    const user = UserSchema.findByIdAndUpdate(id, { isActive: false }, { new: true }).catch(e => {
      return { error: parseDBError(e) }
    })
    return user

  } catch (error) {

    return { error: parseDBError(error) }
  }
}

exports.isActiveUser = async function (id) {
  try {
    const user = await UserSchema.findById(id).lean()
    return user.isActive
  } catch (error) {
    return { error: parseDBError(error) }
  }
}

exports.sendPasswordResetLink = async function (email) {
  const user = await UserSchema.findOne({ email: email }).catch(e => {
    return { error: parseDBError(e) }
  })
  if (!user) {
    return { error: 'email does not belong to any account' }
  }

  const code = randomInt(1000001, 9999999)

  //TODO add attempt checker 

  const resetToken = await ResetTokenSchema.findOneAndUpdate({ user: user._id }, {  user: user._id, code: code }, { upsert: true, new: true }).catch((e) => {
    return { error: parseDBError(e) }
  })

  if (resetToken.error) {
    return resetToken
  }

  const link = `https://futurepay.africa/resetpassword/${user._id}/${code}`


  const response = await sendMail({
    to: user.email,
    subject: 'Password Reset Link',
    html: `<h1>Your reset link is </h1> <a href='${link}'>${link}</a>`
  }).catch(e => {
    console.log(e);
    return { error: 'cannot send email at the moment please try again send fail' }
  })
  return response

}


exports.resetPassword = async function (data) {
  const token = await ResetTokenSchema.findOne({ user: data.user, code: data.code, type: 'password' }).catch(e => {
    return { error: parseDBError(e) }
  })

  if (token == null || token.error) { return token?.error ? token : { error: 'invalid code' } }

  const maxTime = 60 * 2 //token expires after 2hours
  const timeDiff = new Date() - (token.createdAt ?? 0)
  const minutesPassed = Math.floor((timeDiff / 1000) / 60);

  if (minutesPassed >= maxTime) {
    return { error: 'code expired try reseting again' }
  }

  const password = await bcrypt.hash(data.password, 5)

  const user = await UserSchema.findByIdAndUpdate(data.user, { password: password }, { runValidators: true }).catch(e => {
    return { error: parseDBError(e) }
  })
  await token.delete()

  return user

}
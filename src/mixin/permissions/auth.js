const { JWT_TOKEN, JWT_REFRESH_TOKEN } = require('../../../config/secret');
const jwt = require('jsonwebtoken');



exports.generateToken = async (user) => {
  const data = { id: user._id, email: user.email, type:user.type, phone: user.phone, fullname: user.fullname, isActive: user.isActive }
  const token = jwt.sign({ data: data }, JWT_TOKEN, { expiresIn: 60 * 15 }) // update expiration time
  const refreshToken = jwt.sign({ data: data }, JWT_REFRESH_TOKEN, { expiresIn: 60 * 30 })
  user.refreshToken = refreshToken
  user.isActive = true
  await user.save()
  return [token, refreshToken]
}


exports.getsUserFromRefreshToken = async (refreshToken) => {
  try {
    return jwt.verify(refreshToken, JWT_REFRESH_TOKEN)
  } catch (error) {
    return null
  }
}
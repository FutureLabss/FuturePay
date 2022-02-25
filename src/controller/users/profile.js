const { updateUserProfile, getUserProfile } = require("../../services/users/profile")
const fs = require('fs')

exports.updateUserProfile = async function (req, res) {
  const { attempt, email, password, isActive, last_attempt, refreshToken, ...data } = req.body
  const avatar = req.file

  try {
    if (!data) {
      throw new Error('update field is required')
    }
    const user = await updateUserProfile(req.user.id, data, avatar)
    if (user.error) {
      if (avatar) {
        fs.unlinkSync(avatar.path)
      }
      return res.status(400).json(user)
    }
    return res.status(200).send(user)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

exports.getUserProfile = async function (req, res) {
  try {
    const user = await getUserProfile(req.user.id)
    if (user.error) {
      return res.status(400).json(user)
    }
    return res.status(200).send(user)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
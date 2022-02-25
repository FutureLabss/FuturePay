const { parseDBError } = require("../../mixin/dbErrorParser")
const { UserSchema } = require("../../model/user")

exports.updateUserProfile = async function (id, data, avatar) {
  if (avatar) data.avatar = avatar.filename
  try {
    const user = await UserSchema.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .select(['fullname', 'phone', 'gender', 'dob','location', 'avatar'])
      .lean()
      .catch(e => {
        return { error: parseDBError(e) }
      })
    return user

  } catch (error) {

    return { error: parseDBError(error) }
  }
}

exports.getUserProfile = async function (id, data) {
  try {
    const user = UserSchema.findById(id)
      .select(['email', 'fullname', 'phone', 'gender', 'dob','location', 'avatar'])
      .lean()
      .catch(e => {
        return { error: parseDBError(e) }
      })
    return user

  } catch (error) {

    return { error: parseDBError(error) }
  }
}
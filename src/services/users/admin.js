const { UserSchema } = require("../../model/user")
const { userSelectFields } = require("../serializers/user")


exports.getAllUser = async function (page = 0, limit = 10) {
  try {
    return await UserSchema
      .find()
      .select([...userSelectFields])
      .sort({ createdAt: -1 })
      .lean()
      .paginate({ page, limit })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}
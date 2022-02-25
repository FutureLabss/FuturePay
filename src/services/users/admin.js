const { UserSchema } = require("../../model/user")


exports.getAllUser = async function (page = 0, limit = 10) {
  try {
    return await UserSchema.find().select(['phone','email','fullname','type']).paginate({ page, limit })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}
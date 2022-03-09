const { parseDBError } = require('../../mixin/dbErrorParser')
const { UserSchema } = require("../../model/user")




exports.getTotalUser = async function () {
  try {
    return await UserSchema.aggregate()
      .group({ _id: '$type', total: { $sum: 1 } })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}

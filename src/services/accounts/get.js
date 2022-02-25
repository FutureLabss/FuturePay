const { parseDBError } = require("../../mixin/dbErrorParser")
const { AccountSchema, PaymentAccountSchema } = require("../../model/account")
const { accountFields } = require("../serializers/account")

exports.getUserAccount = async function (user) {
  try {
    return AccountSchema.find({ user: user.id })
      .select(['bankName', 'accountCurrency', 'bankNumber', 'accountName', 'recipientBank', 'country', 'city'])
      .populate([...accountFields])
      .lean()
  } catch (error) {
    return { error: parseDBError(error) }
  }
}


exports.getAllAccounts = async function (page = 0, limit = 10) {
  try {
    return await AccountSchema.find().populate([...accountFields]).lean().paginate({ page, limit })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}


exports.getPaymentAccount = async function (filter) {
  try {
    return await PaymentAccountSchema.find({ ...filter })
      .select(['type', 'charge' , 'futureCharge', 'accountName', 'accountNo', 'accountBank'])
      .lean()
  } catch (error) {
    return { error: parseDBError(error) }
  }
}

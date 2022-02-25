const { parseDBError } = require("../../mixin/dbErrorParser")
const { AccountSchema, PaymentAccountSchema } = require("../../model/account")

exports.createAccount = async function (user, data) {
  try {
    data.user = user.id
    const account = AccountSchema({ ...data })
    const error = account.validateSync()
    if (error) {
      throw error
    }
    await account.save()
    return account
  } catch (e) {
    return { error: parseDBError(e) }
  }
}



exports.deleteAccount = async function (id, user) {
  try {
    const account = await AccountSchema.findById(id).select('user')
    if (!account) {
      return { error: 'account not found' }
    }
    if (user.id == account.user || user.type > 2) {
      account.delete()
      return true
    }
    return { error: 'permission denied' }
  } catch (error) {
    return { error: parseDBError(error) }
  }
}


exports.createPaymentAccount = async function(data){
  try {
    const account = PaymentAccountSchema({ ...data })
    const error = account.validateSync()
    if (error) {
      throw error
    }
    await account.save()
    return account
  } catch (e) {
    return { error: parseDBError(e) }
  }
}


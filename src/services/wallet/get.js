const { parseDBError } = require("../../mixin/dbErrorParser")
const { WalletSchema } = require("../../model/wallet")

exports.getUserWallet = async function (user) {
  try {
    return WalletSchema.find({ user: user.id })
      .select(['balance', 'ledgerBalance'])
      .populate('currency', select = ['name'])
      .lean()
  } catch (error) {
    return { error: parseDBError(error) }
  }
}



const { parseDBError } = require('../../mixin/dbErrorParser')
const { CurrencySchema, CurrencyModel } = require('../../model/currency')
const { WalletDepositSchema, WalletWithdrawSchema, WalletFlutterDepositSchema } = require('../../model/wallet')

exports.getDepositStats = async function () {
  try {
    return WalletFlutterDepositSchema.aggregate()
      .lookup({ from: CurrencyModel.collection.name, localField: 'currency', foreignField: '_id', as: 'currency' })
      .unwind('$currency')
      .group({ _id: '', total: { $sum: { $multiply: ['$amount', '$currency.toBase'] } } })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}



exports.getWithdrawStats = async function () {
  try {
    return await WalletWithdrawSchema.aggregate()
      .group({ _id: '$status', total: { $sum: '$amount' } })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}

const { TransactionSchema } = require("../../model/transaction")

const { parseDBError } = require('../../mixin/dbErrorParser')
const { CurrencyModel } = require("../../model/currency")

exports.getTotalTransaction = async function () {
  try {
    return TransactionSchema.aggregate()
      .lookup({ from: CurrencyModel.collection.name, localField: 'from', foreignField: '_id', as: 'currency' })
      .unwind('$currency')
      .group({ _id: '$currency.name', total: { $sum: '$amount' }, count: { $sum: 1 } })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}





exports.getTransactionStats = async function () {
  try {
    return await TransactionSchema.aggregate()
      .group({ _id: '$status', total: { $sum: '$amount' } })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}

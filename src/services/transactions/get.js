const { TransactionSchema } = require("../../model/transaction")

const { parseDBError } = require('../../mixin/dbErrorParser')
const { transactionFields } = require("../serializers/transaction")

exports.getUserTransactions = async function (filter, page = 0, limit = 10) {
  try {
    return TransactionSchema.find({ ...filter })
      .select(['proof', 'toReceive', 'amount', 'payment', 'key', 'status', 'createdAt'])
      .populate([...transactionFields])
      .sort({ createdAt: -1 })
      .lean()
      .paginate({ page, limit })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}


exports.getAllTransactions = async function (filter, page = 0, limit = 10) {
  try {
    return await TransactionSchema.find({ ...filter })
      .sort({ createdAt: -1 })
      .select(['amount', 'toReceive', 'payment', 'status', 'key', 'createdAt'])
      .populate([...transactionFields])
      .lean()
      .paginate({ page, limit })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}

exports.getSingle = async function (id) {
  try {
    return await TransactionSchema.findById(id)
      .select(['proof', 'toReceive', 'amount', 'payment', 'status', 'key', 'createdAt'])
      .populate([...transactionFields])
      .lean()
  } catch (error) {
    return { error: parseDBError(error) }
  }
}

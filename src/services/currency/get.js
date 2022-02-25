const { parseDBError } = require("../../mixin/dbErrorParser")
const { CurrencyModel } = require("../../model/currency")



exports.getCurrencies = async function (filter) {
  try {
    return await CurrencyModel.find({ ...filter })
      .select(['name', 'type', 'isBase', 'toBase'])
      .lean()
  } catch (error) {
    return { error: parseDBError(error) }
  }
}

const { parseDBError } = require("../../mixin/dbErrorParser")
const { CurrencyModel } = require("../../model/currency")

exports.createCurrency = async function (data) {
  try {
    const currency = CurrencyModel({ ...data })
    const error = currency.validateSync()
    if (error) {
      throw error
    }
    await currency.save()
    return currency
  } catch (e) {
    return { error: parseDBError(e) }
  }
}

exports.updateCurrency =  function (id, toBase) {
  try {
    const transaction = CurrencyModel.findByIdAndUpdate(id, { toBase: toBase }, { new: true, runValidators: true })
      .select(['name','type','isBase','toBase'])
      .lean()
      .catch(e => {
        return { error: parseDBError(e) }
      })
    return transaction

  } catch (error) {

    return { error: parseDBError(error) }
  }
}


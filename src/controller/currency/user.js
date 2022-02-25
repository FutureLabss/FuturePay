const { getUserAccount, getPaymentAccount } = require("../../services/accounts/get")
const { createAccount, deleteAccount } = require("../../services/accounts/post")
const { getCurrencies } = require("../../services/currency/get")


exports.getCurrencies = async function (req, res) {
  const {page = 1, limit = 10, ...filter } = req.query

  try {
    const currencies = await getCurrencies(filter)
    if (currencies.error) {
      return res.status(400).json(currencies.error)
    }
    return res.send(currencies)
  } catch (error) {
    return res.status(400).json(error)
  }
}
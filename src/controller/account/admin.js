const { getAllAccounts } = require("../../services/accounts/get")
const { createPaymentAccount } = require("../../services/accounts/post")


exports.getAllAccount = async function (req, resp) {
  const { page = 1, limit = 10 } = req.params
  try {
    const accounts = await getAllAccounts(page, limit)
    return resp.send(accounts)
  } catch (error) {
    return resp.status(400).send(error.message)
  }
}


exports.createPaymentAccount = async function (req, res) {
  const data = req.body
  try {
    const response = await createPaymentAccount(data)
    if (response.error) {
      return res.status(400).json(response)
    }
    return res.status(201).send(response)
  } catch (error) {
    return res.status(400).json(error)
  }
}
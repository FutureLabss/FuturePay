const { getUserAccount, getPaymentAccount } = require("../../services/accounts/get")
const { createAccount, deleteAccount } = require("../../services/accounts/post")


exports.createAccount = async function (req, res) {
  const data = req.body
  try {
    const response = await createAccount(req.user, data)
    if (response.error) {
      return res.status(400).json(response)
    }
    return res.status(201).send(response)
  } catch (error) {
    return res.status(400).json(error)
  }
}


exports.getUserAccount = async function (req, res) {
  try {
    const account = await getUserAccount(req.user)
    if (account.error) {
      return res.status(400).json(account.error)
    }
    return res.send(account)
  } catch (error) {
    return res.status(400).json(error)
  }
}


exports.getPaymentAccount = async function (req, res) {
  const { page = 1, limit = 10, ...filter } = req.query
  //const filter = { type: status }
  try {
    const account = await getPaymentAccount(filter)
    if (account.error) {
      return res.status(400).json(account.error)
    }
    return res.send(account)
  } catch (error) {
    return res.status(400).json(error)
  }
}

exports.deleteAccount = async function (req, res) {
  const { id } = req.params
  try {
    if (!id) {
      throw new Error('id is required')
    }
    const response = await deleteAccount(id, req.user)
    if (response.error) {
      return res.status(400).json(response)
    }
    return res.status(204
      ).send()
  } catch (error) {
    return res.status(400).json({error:error.message})
  }
}
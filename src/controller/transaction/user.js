const { getUserTransactions, getFilterUserTransactions } = require("../../services/transactions/get")
const { createTransactions } = require("../../services/transactions/post")
const fs = require('fs')
const { clearNullField } = require("../../mixin/db/helper")

exports.createTransactions = async (req, res) => {
  const data = req.body
  const file = req.file
  if (!file) {
    return res.status(400).json({ error: 'a proof is required' })
  }
  try {
    const transaction = await createTransactions(req.user, data, file)
    if (transaction.error) {
      fs.unlinkSync(file.path)
      return res.status(400).json(transaction)
    }
    return res.status(201)
      .send({ proof: transaction.proof, _id: transaction.id, key: transaction.key, payment: transaction.payment, createdAt: transaction.createdAt, status: transaction.status, amount: transaction.amount })
  } catch (error) {
    return res.status(400).json(error.message)
  }
}



exports.getUserTransactions = async function (req, res) {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const filter = { user: req.user.id, status: status }
    const transactions = await getUserTransactions(clearNullField(filter), page, limit)
    if (transactions.error) {
      return res.status(400).send(transactions.error)
    }
    return res.send(transactions)
  } catch (error) {
    return res.status(400).send(error.message)
  }
}
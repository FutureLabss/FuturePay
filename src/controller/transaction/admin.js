const { clearNullField } = require("../../mixin/db/helper")
const { getAllTransactions, getSingle } = require("../../services/transactions/get")
const { updateTransactionStatus } = require("../../services/transactions/post")
const path = require('path')
const { getTotalTransaction, getTransactionStats } = require("../../services/transactions/anlysis")

exports.getAllTransactions = async function (req, resp) {
  const { status, page = 1, limit = 10 } = req.query
  const filter = { status: status }
  try {
    const transactions = await getAllTransactions(clearNullField(filter), page, limit)
    return resp.send(transactions)
  } catch (error) {
    return resp.status(400).send(error.message)
  }
}

exports.updateTransactionStatus = async function (req, res) {
  const { id } = req.params
  const { status } = req.body
  try {
    if (!id) {
      throw new Error('id is required')
    }
    if (!status) {
      throw new Error('Status is required')
    }
    const transaction = await updateTransactionStatus(id, status)
    if (transaction.error) {
      return res.status(400).send(transaction.error)
    }
    return res.status(200).send(transaction)
  } catch (error) {
    return res.status(400).send(error.message)
  }
}

exports.getSingle = async function (req, res) {
  const { id } = req.params

  try {
    if (!id || id == 'undefined') {
      throw new Error('id is required or invalid')
    }
    const transaction = await getSingle(id)
    if (transaction.error) {
      return res.status(400).json(transaction.error)
    }
    return res.status(200).send(transaction)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}


exports.downloadProof = async function (req, res) {
  const { id } = req.params
  try {
    if (!id) {
      throw new Error('id is required')
    }
    const transaction = await getSingle(id)
    if (transaction.error) {
      return res.status(400).json(transaction.error)
    }
    return res.download(path.join('storage/' + transaction.proof))
  } catch (error) {
    return res.status(400).json(error.message)
  }
}


exports.getTotalStats = async function (req, res) {

  try {
    const stats = await getTotalTransaction()
    if (stats.error) {
      return res.status(400).json(stats.error)
    }
    return res.status(200).send(stats)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

exports.getAllTransactionStats = async function (req, res) {

  try {
    const stats = await getTransactionStats()
    if (stats.error) {
      return res.status(400).json(stats.error)
    }
    return res.status(200).send(stats)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}
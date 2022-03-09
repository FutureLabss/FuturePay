const { depositToWallet, depositFlutterToWallet } = require("../../services/wallet/deposit")
const { getUserWallet } = require("../../services/wallet/get")
const { createWallet, createWalletTransfer } = require("../../services/wallet/post")
const { withdrawFromWallet, getWalletWithdrawal, getWalletFlutterDeposit } = require("../../services/wallet/withdraw")

const fs = require('fs')
const { clearNullField } = require("../../mixin/db/helper")


exports.createWallet = async function (req, res) {
  if (!req.body.currency) {
    return { error: 'wallet currency must be specified' }
  }

  const data = { currency: req.body.currency }

  try {
    const response = await createWallet(req.user, data)
    if (response.error) {
      return res.status(400).json(response)
    }
    return res.status(201).send(response)
  } catch (error) {
    return res.status(400).json(error)
  }
}


exports.createWalletTransfer = async function (req, res) {

  const data = req.body

  try {
    const response = await createWalletTransfer(req.user, data)
    if (response.error) {
      return res.status(400).json(response)
    }
    return res.status(201).send(response)
  } catch (error) {
    return res.status(400).json(error)
  }
}


exports.getUserWallet = async function (req, res) {

  try {
    const response = await getUserWallet(req.user)
    if (response.error) {
      return res.status(400).json(response.error)
    }
    return res.send(response)
  } catch (error) {
    return res.status(400).json(error)
  }
}


exports.depositToWallet = async (req, res) => {
  const data = req.body
  const file = req.file
  if (!file) {
    return res.status(400).json({ error: 'a proof is required' })
  }
  try {
    const walletDeposit = await depositToWallet(req.user, data, file)
    if (walletDeposit.error) {
      fs.unlinkSync(file.path)
      return res.status(400).json(walletDeposit)
    }
    return res.status(201).send(walletDeposit)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}


exports.depositFlutterToWallet = async (req, res) => {
  let data = req.body
  
  try {
    const walletDeposit = await depositFlutterToWallet(req.user, data)
    if (walletDeposit.error) {
      return res.status(400).json(walletDeposit)
    }
    return res.status(201).send(walletDeposit)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}


exports.withdrawFromWallet = async (req, res) => {
  const data = req.body
  try {
    const walletDeposit = await withdrawFromWallet(req.user, data)
    if (walletDeposit.error) {
      return res.status(400).json(walletDeposit)
    }
    return res.status(201).send(walletDeposit)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}


exports.getWalletWithdrawal = async function (req, res) {

  const { status, page = 1, limit = 10 } = req.query
  const filter = { status: status, user:req.user.id }
  try {
    const response = await getWalletWithdrawal(clearNullField(filter), page, limit)
    if (response.error) {
      return res.status(400).json(response.error)
    }
    return res.send(response)
  } catch (error) {
    return res.status(400).json(error)
  }
}



exports.getWalletFlutterDeposit = async function (req, res) {

  const { status, page = 1, limit = 10 } = req.query
  const filter = { status: status, user:req.user.id }
  try {
    const response = await getWalletFlutterDeposit(clearNullField(filter), page, limit)
    if (response.error) {
      return res.status(400).json(response.error)
    }
    return res.send(response)
  } catch (error) {
    return res.status(400).json(error)
  }
}
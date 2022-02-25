const { getDepositStats } = require("../../services/wallet/anlysis")
const { updateWalletDepositStatus } = require("../../services/wallet/deposit")
const { updateWalletWithdrawStatus, getWalletFlutterDeposit } = require("../../services/wallet/withdraw")

exports.updateWalletDepositStatus = async function (req, res) {
  const { id } = req.params
  const { status } = req.body
  try {
    if (!id) {
      throw new Error('id is required')
    }
    if (!status) {
      throw new Error('Status is required')
    }
    const walletDeposit = await updateWalletDepositStatus(id, status,req.user)
    if (walletDeposit.error) {
      return res.status(400).send(walletDeposit)
    }
    return res.status(200).send(walletDeposit)
  } catch (error) {
    return res.status(400).send(error.message)
  }
}

exports.updateWalletWithdrawStatus = async function (req, res) {
  const { id } = req.params
  const { status } = req.body
  try {
    if (!id) {
      throw new Error('id is required')
    }
    if (!status) {
      throw new Error('Status is required')
    }
    const walletDeposit = await updateWalletWithdrawStatus(id, status,req.user)
    if (walletDeposit.error) {
      return res.status(400).send(walletDeposit)
    }
    return res.status(200).send(walletDeposit)
  } catch (error) {
    return res.status(400).send(error.message)
  }
}


exports.getAllDepositStats = async function (req, res) {

  try {
    const stats = await getDepositStats()
    if (stats.error) {
      return res.status(400).json(stats.error)
    }
    return res.status(200).send(stats)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}
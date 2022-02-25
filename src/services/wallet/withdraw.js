const { parseDBError } = require("../../mixin/dbErrorParser")
const { WalletWithdrawSchema, WalletSchema, WalletDepositSchema, WalletFlutterDepositSchema } = require("../../model/wallet")

const mongoose = require('mongoose')
const { calculateExchangeRate } = require("../../mixin/services/currency")


const KEY_COUNT = 1000495990


exports.withdrawFromWallet = async function (user, data) {
  try {
    let withdrawModel = WalletWithdrawSchema({ ...data, user: user.id })
    const error = withdrawModel.validateSync()
    if (error) {
      throw error
    }

    withdrawModel = await withdrawModel.populate([
//      { path: 'account', select: ['currency'], populate: { path: 'currency' } },
      { path: 'wallet', select: ['currency', 'user','balance'], populate: { path: 'currency', select: ['name','toBase'] } },
      //{ path: 'currency', select: ['toBase', 'name'], populate: { path: 'currency', select: ['name','toBase'] } },
    ])
    if (user.id != withdrawModel.wallet.user) {
      return { error: 'invalid user wallet' }
    }
    
    
    if (withdrawModel.wallet.balance < data.amount) {
      return { error: 'insufficient balance' }
    }
    
    const count = await WalletWithdrawSchema.count()
    const prefix = `FUTWIT${KEY_COUNT}${count + 1}`
    withdrawModel.key = prefix
    //withdrawModel.toReceive = calculateExchangeRate( withdrawModel.wallet.currency, withdrawModel.currency, data.amount)

    await withdrawModel.save()

    //notify listeners
    //sendTransactionNotification(depositModel, user, 'create')

    return withdrawModel
  } catch (e) {
    return { error: parseDBError(e) }
  }
}


exports.updateWalletWithdrawStatus = async function (id, status, user) {
  try {
    const walletWithdraw = await WalletWithdrawSchema.findByIdAndUpdate(id, { status: status, agent: user.id }, { new: true, runValidators: true })
      .select(['wallet', 'currency', 'amount', 'toReceive', 'status', 'approved'])
      .populate('account', select = ['currency'])
      .catch(e => {
        return { error: parseDBError(e) }
      })


    if (!walletWithdraw || walletWithdraw.error) {
      return walletWithdraw ?? { error: 'invalid wallet' }
    }
    if (status == 'successful' && !walletWithdraw.approved) {
      const deposited = await updateWalletBalance(walletWithdraw)
      if (deposited.error) {
        walletWithdraw.status = 'failed'
        await walletWithdraw.save()
        return deposited
      }
    }
    // sendDepositNotification(walletDeposit, walletDeposit.user, 'update')

    return walletWithdraw

  } catch (error) {

    return { error: parseDBError(error) }
  }
}

exports.getWalletWithdrawal = async function (filter, page = 0, limit = 10) {
  try {
    return WalletWithdrawSchema.find({ ...filter })
      .select(['amount', 'status', 'toReceive', 'key', 'status', 'createdAt', 'account', 'wallet'])
      .populate([
        { path: 'account', select: ['accountCurrency', 'accountName', 'recipientBank', 'bankNumber',] },
        { path: 'wallet', select: ['currency'], populate: { path: 'currency', select: ['name'] } },
      ])
      .sort({ createdAt: -1 })
      .lean()
      .paginate({ page, limit })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}

exports.getWalletFlutterDeposit = async function (filter, page = 0, limit = 10) {
  try {
    return WalletFlutterDepositSchema.find({ ...filter })
      .select(['amount', 'status', 'key', 'status', 'createdAt', 'chargedAmount', 'wallet'])
      .populate([
        { path: 'currency', select: ['name',] },
        { path: 'wallet', select: ['currency'], populate: { path: 'currency', select: ['name'] } },
      ])
      .sort({ createdAt: -1 })
      .lean()
      .paginate({ page, limit })
  } catch (error) {
    return { error: parseDBError(error) }
  }
}


async function updateWalletBalance(walletWithdraw) {

  const session = await mongoose.startSession()
  session.startTransaction()
  try {

    let wallet = await WalletSchema.findById(walletWithdraw.wallet).select(['balance'])

    if (wallet.balance < walletWithdraw.toReceive) {
      throw new Error('insufficient balance')
    }

    walletWithdraw.approved = true
    walletWithdraw.status = 'paid'
    wallet.balance -= walletWithdraw.toReceive

    await walletWithdraw.save()
    await wallet.save()

    session.commitTransaction()

  } catch (e) {

    session.abortTransaction()
    session.endSession()

    return { error: parseDBError(e) }

  } finally {
    session.endSession()
  }
  return true
}
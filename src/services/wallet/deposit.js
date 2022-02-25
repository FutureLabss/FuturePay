const { parseDBError } = require("../../mixin/dbErrorParser")
const { WalletDepositSchema, WalletSchema, WalletFlutterDepositSchema } = require("../../model/wallet")

const mongoose = require('mongoose')
const { calculateExchangeRate } = require("../../mixin/services/currency")
const { FLWAVE_SECRET } = require("../../../config/secret")

const KEY_COUNT = 1000495990


exports.depositToWallet = async function (user, data, file) {
  try {
    let depositModel = WalletDepositSchema({ ...data, proof: file.filename })
    const error = depositModel.validateSync()
    if (error) {
      throw error

    }

    depositModel = await depositModel.populate([
      { path: 'wallet', select: ['currency', 'user'], populate: { path: 'currency', select: ['toBase', 'name'] } },
      { path: 'currency', select: ['toBase', 'name'] }
    ])
    if (user.id != depositModel.wallet.user) {
      return { error: 'invalid user wallet' }
    }

    const count = await WalletDepositSchema.count()
    const prefix = `FUTDEP${KEY_COUNT}${count + 1}`
    depositModel.key = prefix
    depositModel.toReceive = calculateExchangeRate(depositModel.currency, depositModel.wallet.currency, depositModel.amount)

    await depositModel.save()

    //notify listeners
    //sendTransactionNotification(depositModel, user, 'create')

    return depositModel
  } catch (e) {
    console.log(e)
    return { error: parseDBError(e) }
  }
}


exports.depositFlutterToWallet = async function (user, data) {
  const axios = require('axios')
  try {

    let tempModel = await WalletFlutterDepositSchema.findOne({txId:data.txId})
    if(tempModel){
      return {error: 'cannot double spend'}
    }

    let depositModel = WalletFlutterDepositSchema({ ...data ,user:user.id})
    const error = depositModel.validateSync()

    if (error) { throw error }

    depositModel = await depositModel.populate([
      { path: 'wallet', select: ['currency', 'user'], populate: { path: 'currency', select: ['toBase', 'name'] } },
      { path: 'currency', select: ['toBase', 'name'] }
    ])

    if (user.id != depositModel.wallet.user) {
      return { error: 'invalid user wallet' }
    }

    const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${depositModel.txId}/verify`, {
      headers: { 'Authorization': `Bearer ${FLWAVE_SECRET}` }
    }).catch((err) => {
      return { error: parseDBError(err) }
    })

    if(depositModel.txId!=response.data.data.id || depositModel.flwRef != response.data.data.flw_ref){
      return {error:'invalid transaction'}
    }


    const count = await WalletFlutterDepositSchema.count()
    const prefix = `FUTDEP${KEY_COUNT}${count + 1}`
    depositModel.key = prefix
    depositModel.chargedAmount = response.data.data.charged_amount
    depositModel.toReceive = calculateExchangeRate(depositModel.currency, depositModel.wallet.currency, depositModel.chargedAmount)

    await depositModel.save()

    if (response.data.data.status == 'successful') {
      updateWalletBalance(depositModel)
    }
    //notify listeners
    //sendTransactionNotification(depositModel, user, 'create')

    return depositModel
  } catch (e) {
    //console.log(e)
    return { error: parseDBError(e) }
  }
}



exports.updateWalletDepositStatus = async function (id, status, user, isFlutter = fa) {
  try {
    const walletDeposit = await WalletDepositSchema.findByIdAndUpdate(id, { status: status, agent: user.id }, { new: true, runValidators: true })
      .select(['wallet', 'currency', 'amount', 'toReceive', 'status', 'approved'])
      .populate('currency', select = ['toBase'])
      .catch(e => {
        return { error: parseDBError(e) }
      })


    if (!walletDeposit || walletDeposit.error) {
      return walletDeposit ?? { error: 'invalid wallet' }
    }


    if (status == 'successful' && !walletDeposit.approved) {
      const deposited = await updateWalletBalance(walletDeposit)

      if (deposited.error) {
        walletDeposit.status = 'failed'
        await walletDeposit.save()
        return deposited
      }
    }
    // sendDepositNotification(walletDeposit, walletDeposit.user, 'update')

    return walletDeposit

  } catch (error) {

    return { error: parseDBError(error) }
  }
}


async function updateWalletBalance(walletDeposit) {

  const session = await mongoose.startSession()
  session.startTransaction()
  try {

    if (walletDeposit.approved) {
      return { error: 'cannot double spend' }
    }

    let wallet = await WalletSchema.findById(walletDeposit.wallet).select(['balance'])

    walletDeposit.approved = true
    walletDeposit.status = 'paid'
    wallet.balance += walletDeposit.toReceive

    await walletDeposit.save()
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
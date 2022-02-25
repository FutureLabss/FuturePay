const { parseDBError } = require("../../mixin/dbErrorParser")
const { WalletSchema, WalletTransferSchema } = require("../../model/wallet")
const mongoose = require('mongoose')
const { UserSchema } = require("../../model/user")



exports.createWallet = async function (user, data) {
  try {
    let wallet = WalletSchema({ ...data, user: user.id })
    const error = wallet.validateSync()
    if (error) {
      throw error
    }
    wallet.save()
    wallet = wallet.populate('currency', ['name'])
    return wallet
  } catch (e) {
    return { error: parseDBError(e) }
  }
}


exports.createWalletTransfer = async function (user, data) {
  const receiveUser = data.user ? await UserSchema.findOne({ email: data.user }) : user
  if (receiveUser == null) {
    return { error: 'receipiant has no account' }
  }

  const receiveWallet = await WalletSchema.findOneAndUpdate({ 'user': receiveUser._id ?? receiveUser.id, currency: data.currency }, {}, { upsert: true })
    .catch((e) => {
      return { error: parseDBError(error) }
    })
  data.user = user.id

  // calculate to receive currency locally
  // (baseCurrency?.toBase / toCurrency?.toBase) / (baseCurrency?.toBase / fromCurrency?.toBase)

  const walletTransferModel = WalletTransferSchema({ ...data, receiveWallet: receiveWallet._id })
  const error = walletTransferModel.validateSync()
  if (error) {
    return { error: parseDBError(error) }
  }
  await walletTransferModel.save()
  const transfer = await walletTransfer(data, receiveWallet)

  if (transfer.error) {
    walletTransferModel.status = 'failed'
    await walletTransferModel.save()
    return transfer
  }
  walletTransferModel.status = 'successful'
  await walletTransferModel.save()
  return walletTransferModel

}

const walletTransfer = async function (data, receiveWallet) {
  //data = {wallet,}
  const session = await mongoose.startSession()
  session.startTransaction()
  try {

    let sendWallet = await WalletSchema.findById(data.sendWallet).select(['balance'])

    if (sendWallet.balance < data.toReceive) {
      throw new Error('insufficient balance')
    }


    sendWallet.balance -= data.toReceive
    receiveWallet.balance += data.toReceive

    await sendWallet.save()
    await receiveWallet.save()
    session.commitTransaction()
  } catch (e) {
    session.abortTransaction()
    session.endSession()
    return { error: parseDBError(e) }
  } finally {
    session.endSession()
  }
  return true
  //
}
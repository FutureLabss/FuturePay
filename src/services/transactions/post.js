const { sendMail } = require("../../../config/mail")
const { parseDBError } = require("../../mixin/dbErrorParser")
const { calculateExchangeRate } = require("../../mixin/services/currency")
const { TransactionSchema } = require("../../model/transaction")
const { transactionFields } = require("../serializers/transaction")

const KEY_COUNT = 1000000020


exports.createTransactions = async function (user, data, file) {
  try {
    let transaction = TransactionSchema({ ...data, user: user.id, proof: file.filename })
    const error = transaction.validateSync()
    if (error) {
      throw error
    }
    const count = await TransactionSchema.count()
    const prefix = `FUTPAY${KEY_COUNT}${count + 1}`
    transaction = await transaction.populate([...transactionFields])
    transaction.toReceive = calculateExchangeRate(transaction.from,transaction.to,transaction.amount)
    if (user.id != transaction.account.user) {
      return { error: 'invalid user account' }
    }
    transaction.key = prefix

    await transaction.save()

    //notify listeners
    sendTransactionNotification(transaction, user, 'create')

    return transaction
  } catch (e) {
    return { error: parseDBError(e) }
  }
}

exports.updateTransactionStatus = async function (id, status) {
  try {
    const transaction = TransactionSchema.findByIdAndUpdate(id, { status: status }, { new: true, runValidators: true })
      .select(['proof','toReceive', 'amount', 'payment', 'status', 'key', 'createdAt'])
      .populate([...transactionFields])
      .catch(e => {
        return { error: parseDBError(e) }
      })

    sendTransactionNotification(transaction, transaction.user, 'update')
    return transaction

  } catch (error) {

    return { error: parseDBError(error) }
  }
}



const sendTransactionNotification = async function (transaction, user, type) {


  const message = `
  <dl>
  <dt> Amount </dt>
  <dd> ${transaction.account?.accountCurrency} ${transaction.amount}  </dd>
  
  <dt> Account </dt>
  <dd> ${transaction.account?.accountName} </dd>

  <dt> Status </dt>
  <dd> ${transaction.status} </dd>
  
  </dl>
  `


  //TODO add attempt checker 

  const response = await sendMail({
    to: user.email,
    subject: type == 'create' ? 'Transaction Created' : 'Transaction Update',
    html: "<h4> Transaction details Details </h4>" + message
  }).catch(e => {
    console.log(e);
    return { error: 'cannot send email at the moment please try again send fail' }
  })

  //notify admin

  sendMail({
    to: 'payments@futurepay.app',
    subject: type == 'create' ? 'Transaction Created' : 'Transaction Update',
    html: "<h4> Transaction details Details </h4>" + message
  }).catch(e => {
    console.log(e);
    return { error: 'cannot send email at the moment please try again send fail' }
  })
  return response

}


//TODO: change to function and add exclude login
exports.transactionFields = [
  { path: 'user', select: ['firstname', 'email', 'phone'] },
  { path: 'from', select: ['name', 'toBase'] },
  { path: 'to', select: ['name', 'toBase'] },
  { path: 'account', select: ['accountCurrency', 'accountName', 'bankNumber', 'user', 'recipientBank'] },
]

exports.transactionFieldsDetailed = [
  { path: 'user', select: ['firstname', 'email', 'phone'] },
  { path: 'from', select: ['name', 'toBase'] },
  { path: 'to', select: ['name', 'toBase'] },
  { path: 'account', select: ['accountCurrency', 'accountName', 'bankNumber', 'user', 'recipientBank'] },
  { path: 'paymentAccount', select: ['accountName', 'accountNo', 'accountBank', 'charge', 'futureCharge'] }
]


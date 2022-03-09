
const { clearNullField } = require("../../mixin/db/helper")
const { getWalletWithdrawal } = require("../../services/wallet/withdraw")



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
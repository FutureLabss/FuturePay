const { createCurrency, updateCurrency } = require("../../services/currency/post")


exports.updateCurrency = async function (req, res) {
  const { id } = req.params
  const { toBase } = req.body
  try {
    if (!id) {
      throw new Error('id is required')
    }
    if (!toBase) {
      throw new Error('Exchange rate to base  is required')
    }
    const currency = await updateCurrency(id, toBase)
    if (currency.error) {
      return res.status(400).send(currency.error)
    }
    return res.status(200).send(currency)
  } catch (error) {
    return res.status(400).send(error.message)
  }
}


exports.createCurrency = async function (req, res) {
  const { isBase = false, ...data } = req.body
  try {
    const response = await createCurrency(data)
    if (response.error) {
      return res.status(400).json(response)
    }
    return res.status(201).send(response)
  } catch (error) {
    return res.status(400).json(error)
  }
}
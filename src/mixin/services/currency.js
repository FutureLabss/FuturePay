
exports.calculateExchangeRate = (from, to, amount) => {
  const er = ((1 / to?.toBase) / (1 / from?.toBase))
  return amount * er

}
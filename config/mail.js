var nodemailer = require('nodemailer');

const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT ?? 'noreply@futurepay.app'
const EMAIL_KEY = process.env.EMAIL_KEY ?? 'Wewin@allcost2021'

var transporter = nodemailer.createTransport({
  host: 'premium78.web-hosting.com',
  port: 465,
  auth: {
    user: EMAIL_ACCOUNT,
    pass: EMAIL_KEY
  }
});

transporter.verify((e, s) => {
  if (e) {
    console.log('email connection error')
  } else {
    console.log('email connection success')
  }
})


exports.sendMail = function (data) {
  return transporter.sendMail({ ...data, from: EMAIL_ACCOUNT })

}

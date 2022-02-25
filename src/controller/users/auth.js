const { generateToken } = require("../../mixin/permissions/auth")
const { signUp, login, getUserFromRefreshToken, sendPasswordResetLink, logOut, resetPassword } = require("../../services/users/auth")


async function auth(user, res) {
  const [token, refreshToken] = await generateToken(user)
  return res.status(201).json({ token: token, refreshToken: refreshToken, email: user.email, type: user.type, fullName: user.fullname })

}


exports.signUp = async function (req, res) {
  const data = req.body
  try {
    const user = await signUp(data)

    if (user.error) {
      return res.status(400).json(user)
    }
    return auth(user, res)
  } catch (e) {
    return res.status(400).json(e)
  }
}

exports.login = async function (req, res) {
  const data = req.body
  try {
    const user = await login(data)
    if (user.error) {
      return res.status(400).json(user)
    }
    return auth(user, res)
  } catch (e) {
    return res.status(400).send(e.message)
  }
}


exports.getNewToken = async function (req, res) {
  const refreshToken = req.body.refreshToken
  const user = await getUserFromRefreshToken(refreshToken)
  if (!user || user.error) {
    return res.status(401).json({ error: 'invalid refresh token' })
  } else if (!user.isActive) {
    return res.status(401).json({ error: 'session expired ' })
  }
  return auth(user, res)
}


exports.forgotPassword = async function (req, res) {
  const email = req.body?.email

  if (!email) {
    return res.status(400).json({ error: 'email is required' })
  }

  try {
    console.log('sending mail')
    const user = await sendPasswordResetLink(email)
    if (user.error) {
      return res.status(400).json(user)
    }
    
  } catch (e) {
    return res.status(400).json({error:e.message})
  }


  return res.status(201).send('reset link has been sent')

}


exports.resetPassword = async function (req, res) {
  const data = req.body
  if (!(data.user && !isNaN(data.code) && data.password)) {
    return res.status(400).json({ error: 'invalid reset link' })
  }

  const user = await resetPassword(data)

  if (user.error) {
    return res.status(400).json(user)
  }

  return res.status(201).send('reset password sucessful')

}



exports.logOut = async function (req, res) {
  const resp = await logOut(req.user.id)
  if (resp.error) {
    return res.status(400).send(resp.error)
  }
  return res.status(204).send()
}

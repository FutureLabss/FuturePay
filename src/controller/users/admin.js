const { getAllUser } = require("../../services/users/admin")



exports.getAllUser = async function (req, resp) {
  const { page = 1, limit = 10 } = req.query
  try {
    const users = await getAllUser(page, limit)
    if(users.error){
      return resp.status(400).send(users.error)
    }
    return resp.send(users)
  } catch (error) {
    return resp.status(400).send(error.message)
  }
}
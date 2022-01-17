const User = require("../models/User")
const mongoose = require('mongoose')

const authenticate = async (req, res, next) => {
  const { sessionid } = req.headers
  // DB에 부하를 주기전에 최소한의 체크를 해본다.
  if (!sessionid || !mongoose.isValidObjectId(sessionid)) return next()
  const user = await User.findOne({ "sessions._id": sessionid })
  if(!user) return next()
  req.user = user
  return next()
}

module.exports = authenticate
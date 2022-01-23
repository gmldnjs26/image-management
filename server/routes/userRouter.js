const { Router } = require('express')
const userRouter = Router();
const User = require("../models/User")
const { hash, compare } = require('bcryptjs')
const mongoose = require('mongoose')

userRouter.post("/register", async (req, res) => {
  try {
    if (req.body.password.length < 6) throw new Error('password is too short')
    if (req.body.username.length < 3) throw new Error("username is too short")
    const hashedPassword = await hash(req.body.password, 10)
    console.log(hashedPassword)
    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      sessions: [{ createdAt: new Date() }]
    }).save()
    const session = user.sessions[0]
    res.json({ message: 'user registered', sessionID: session._id, name: user.name })
  } catch(err) {
    res.status(400).json({ message: err.message })
  }
})

// post -> patch 
userRouter.patch("/login", async(req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if(!user) throw new Error("Failed")
    const isValid = await compare(req.body.password, user.password)
    if(!isValid) throw new Error("Failed")
    user.sessions.push({ createdAt: new Date() })
    const session = user.sessions[user.sessions.length - 1]
    await user.save()
    res.json({
      message: "user validated",
      sessionId: session._id,
      name: user.name,
      userId: user._id
    })
  } catch(err) {
    res.status(400).json({ message: err.message })
  }
})

userRouter.patch("/logout", async(req, res) => {
  try {
    if(!req.user) throw new Error("invalid session id")
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } } // mongoDB query language
    )
    res.json({ message: "user is logged out" })
  } catch(err) {
    res.status(400).json({
      message: err.message
    })
  }
})

userRouter.get("/me", async(req, res) => {
  try {
    if(!req.user) throw new Error("권한이 없습니다.")
    res.json({
      message: "success",
      sessionId: req.headers.sessionid,
      name: req.user.name,
      userId: req.user._id
    })
  } catch(err) {
    console.error(err)
    res.status(400).json({
      message: err.message
    })
  }
})

userRouter.get('/me', (req, res) => {
  // 본인의 사진들만 리턴
})

module.exports = { userRouter }
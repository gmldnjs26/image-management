require("dotenv").config()
const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose")
const imageRouter = require("./routes/imageRouter")
const { userRouter } = require('./routes/userRouter')


const app = express();
const PORT = 5555;
let corsOption = {
  origin: 'http://localhost:3000',
  credential: true
}

mongoose
  .connect(process.env.mongo_uri)
  .then(() => {
    console.log("MongoDB Connected")
    app.use(cors(corsOption))
    app.use("/uploads", express.static("uploads")) // 외부에서 uploads라는 폴더에 접근할 수 있게
    app.use(express.json()) // req.body에 json형식으로 저장하기 위해
    app.use("/images", imageRouter)
    app.use("/users", userRouter)
    app.listen(PORT, () => console.log("Express Server listening on PORT " + PORT))
  })
  .catch((err) => console.log(err))
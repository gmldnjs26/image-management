require("dotenv").config()
const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose")
const imageRouter = require("./routes/imageRouter")


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
    app.listen(PORT, () => console.log("Express Server listening on PORT " + PORT))
    app.use("/uploads", express.static("uploads")) // 외부에서 uploads라는 폴더에 접근할 수 있게
    app.use("/images", imageRouter)
  })
  .catch((err) => console.log(err))
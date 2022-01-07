require("dotenv").config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { v4: uuid } = require('uuid')
const mime = require("mime-types")
const mongoose = require("mongoose")
const Image = require('./models/image')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"), // 파일에 따라 저장되는 폴더를 다르게 할 수 있다.
  filename: (req, file, cb) => 
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`) // 파일에 따라 저장되는 파일이름을 다르게 할 수 있다.
})
const upload = multer({
  storage, 
  fileFilter: (req, file, cb) => {
    if (["image/png",'image/jpeg'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('invalid file types'), false)
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  }
})

const app = express();
const PORT = 5555;

mongoose
  .connect(process.env.mongo_uri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err))

let corsOption = {
  origin: 'http://localhost:3000',
  credential: true
}

app.use(cors(corsOption))

app.use("/uploads", express.static("uploads")) // 외부에서 uploads라는 폴더에 접근할 수 있게

app.post('/upload',　upload.single("image"), async (req, res) => {
  console.log(req.file)
  await new Image({ key: req.file.filename, originalFileName: req.file.originalname }).save()
  res.json({result: 'success'});
})

app.listen(PORT, () => console.log("Express Server listening on PORT " + PORT))
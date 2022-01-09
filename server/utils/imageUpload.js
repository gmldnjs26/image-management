const multer = require('multer')
const { v4: uuid } = require('uuid')
const mime = require("mime-types")

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

module.exports = upload
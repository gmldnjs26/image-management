const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    // id 는 자동으로 생김
    key: { type: String, required: true },
    originalFileName: { type: String, required: true }
  }, 
  { timestamps: true }
);

module.exports = mongoose.model("image", ImageSchema)
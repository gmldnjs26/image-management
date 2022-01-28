const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const upload = require("../utils/imageUpload");

imageRouter.post("/", upload.single("image"), async (req, res) => {
  // 유저정보, public유무 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    const image = await new Image({
      user: {
        // id로 불러내면 _id로 저장된 ObjectId에서 자동으로 String형태로 전환된다.
        // 근데 _id는 ObjectId가 type인데 string으로 저장해도 되냐? 몽구스가 알아서 처리해준다
        // 그리고 ObjectId로 안하면 string으로 되버리기 때문에 용량이 더 커지게 된다 ObjectId가 더 효율적
        _id: req.user.id,
        name: req.user.name,
        username: req.user.username,
      },
      public: req.body.public,
      key: req.file.filename,
      originalFileName: req.file.originalname,
    }).save();
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});
imageRouter.get("/", async (req, res) => {
  // public 이미지 제공
  const images = await Image.find({ public: true });
  res.json(images);
});

imageRouter.delete("/:imageId", (req, res) => {
  // 유저 권한 확인
  // 사진 삭제
});

imageRouter.patch("/:imageId/like", (req, res) => {
  // 유저 권한 확인
  // like 중복 안되도록 확인
});

imageRouter.patch("/:imageId/unlike", (req, res) => {
  // 유저 권한 확인
  // like 중복 취소 안되도록 확인
});

module.exports = imageRouter;

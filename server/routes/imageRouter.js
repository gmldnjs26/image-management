const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/Image");
const upload = require("../utils/imageUpload");
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");
const { s3, getSignedUrl } = require("../aws");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

const fileUnlink = promisify(fs.unlink); // unlink함수에 원래라면 콜백함수를 넣지만 프로미스화해서 async await형식으로 바꿀 수 있다.

imageRouter.post("/presigned", async (req, res) => {
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    const { contentTypes } = req.body;
    if (!Array.isArray(contentTypes)) throw new Error("invalid contentTypes");
    const presignedData = await Promise.all(
      contentTypes.map(async (contentType) => {
        const imageKey = `${uuid()}.${mime.extension(contentType)}`;
        const key = `raw/${imageKey}`;
        const presigned = await getSignedUrl(key);
        return { imageKey, presigned };
      })
    );
    return res.json(presignedData);
  } catch (err) {
    console.log(err);
  }
});
imageRouter.post("/", upload.array("image", 5), async (req, res) => {
  // 유저정보, public유무 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    const { images, public } = req.body;

    const imageDocs = await Promise.all(
      images.map(
        (image) =>
          new Image({
            user: {
              _id: req.user.id,
              name: req.user.name,
              username: req.user.username,
            },
            public,
            key: image.imageKey,
            originalFileName: image.originalname,
          })
      )
    );
    res.json(imageDocs);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});
// imageRouter.post("/", upload.array("image", 5), async (req, res) => {
//   // 유저정보, public유무 확인
//   try {
//     if (!req.user) throw new Error("권한이 없습니다.");
//     const result = await Promise.all(
//       req.files.map(async (file) => {
//         const image = await new Image({
//           user: {
//             // id로 불러내면 _id로 저장된 ObjectId에서 자동으로 String형태로 전환된다.
//             // 근데 _id는 ObjectId가 type인데 string으로 저장해도 되냐? 몽구스가 알아서 처리해준다
//             // 그리고 ObjectId로 안하면 string으로 되버리기 때문에 용량이 더 커지게 된다 ObjectId가 더 효율적
//             _id: req.user.id,
//             name: req.user.name,
//             username: req.user.username,
//           },
//           public: req.body.public,
//           key: file.key.replace("raw/", ""),
//           originalFileName: file.originalname,
//         }).save();
//         return image;
//       })
//     );
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: err.message });
//   }
// });
imageRouter.get("/", async (req, res) => {
  // public 이미지 제공
  try {
    const { lastId } = req.query;
    if (lastId && !mongoose.isValidObjectId(lastId))
      throw new Error("invalid lastId");
    const images = await Image.find(
      lastId
        ? {
            public: true,
            _id: { $lt: lastId },
          }
        : {
            public: true,
          }
    )
      .sort({ _id: -1 })
      .limit(20);
    res.json(images);
  } catch (err) {
    console.error(err);
  }
});

imageRouter.get("/:imageId", async (req, res) => {
  // 유저 권한 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId)) {
      throw new Error("올바르지 않은 이미지 아이디 입니다.");
    }
    const image = await Image.findOne({ _id: req.params.imageId });
    if (!image) throw new Error("존재하지 않는 사진입니다.");
    // _id는 객체로 반환 .id는 몽구스에 string변환해서 반환
    if (!image.public && (!req.user || req.user.id !== image.user.id))
      throw new Error("권한이 없습니다.");
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
  // 사진 삭제
});
imageRouter.delete("/:imageId", async (req, res) => {
  // 유저 권한 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId)) {
      throw new Error("올바르지 않은 이미지 아이디 입니다.");
    }
    const image = await Image.findOneAndDelete({ _id: req.params.imageId });
    if (!image) {
      throw new Error("이미 삭제된 사진입니다.");
    }
    // await fileUnlink(`./uploads/${image.key}`);
    s3.deleteObject(
      { Bucket: "first-image-storage", Key: `raw/${image.key}` },
      (err) => {
        if (err) throw err;
      }
    );
    res.json({ message: "요청하신 이미지가 삭제되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
  // 사진 삭제
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  // 유저 권한 확인
  // like 중복 안되도록 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 아이디 입니다.");

    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $addToSet: { likes: req.user.id } }, // addToSet Set과 같이 알아서 중복일 경우에는 칼람값을 추가하지 않는다.
      { new: true } // 업데이트 된 이후의 image를 받는다
    );
    res.json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  // 유저 권한 확인
  // like 중복 취소 안되도록 확인
  try {
    if (!req.user) throw new Error("권한이 없습니다.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("올바르지 않은 아이디 입니다.");

    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = imageRouter;

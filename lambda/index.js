const sharp = require("sharp");
const aws = require("aws-sdk");
const s3 = new aws.S3();

const transformationOptions = [
  { name: "w140", width: 140 },
  { name: "w600", width: 600 },
];

exports.handler = async (event) => {
  try {
    const Key = event.Records[0].s3.object.key;
    const keyOnly = Key.split("/")[1];
    console.log(`Image Resizing: ${keyOnly}`);
    const image = await s3
      .getObject({ Bucket: "first-image-storage", Key })
      .promise();
    console.log("Get Image Success", image);
    await Promise.all(
      transformationOptions.map(async ({ name, width }) => {
        try {
          const newKey = `${name}/${keyOnly}`;
          console.log("newKey", newKey);

          const resizedImage = await sharp(image.Body)
            .rotate()
            .resize({ width: width, height: width, fit: "outside" }) // 가로 세로 비율을 생각해서 더 작은 친구를 width에 맞춰 축소한다.
            .toBuffer();
          await s3
            .putObject({
              Bucket: "first-image-storage",
              Body: resizedImage,
              Key: newKey,
            })
            .promise();
        } catch (err) {
          throw err;
        }
      })
    );
    return {
      statusCode: 200,
      body: event,
    };
  } catch (err) {
    console.log("!!!!!!!!!!!!Error: ", err);
    return {
      statusCode: 500,
      body: event,
    };
  }
};

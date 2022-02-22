const { AWS_SECRET_KEY, AWS_ACCESS_KEY } = process.env;

const aws = require("aws-sdk");

console.log(AWS_SECRET_KEY, AWS_ACCESS_KEY);

const s3 = new aws.S3({
  secretAccessKey: AWS_SECRET_KEY,
  accessKeyId: AWS_ACCESS_KEY,
});

module.exports = { s3 };

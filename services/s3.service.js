const AWS = require('aws-sdk');

const {
  S3_ACCESS_KEY: accessKeyId,
  S3_SECRET_KEY: secretAccessKey,
} = process.env;

// const wasabiEndpoint = new AWS.Endpoint('s3.wasabisys.com');
const s3 = new AWS.S3({
  // endpoint: wasabiEndpoint,
  accessKeyId,
  secretAccessKey,
});
module.exports = {
  s3,
  // wasabiEndpoint,
};

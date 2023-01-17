const AWS = require('aws-sdk');
require("dotenv").config();
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ACCESS_KEY2,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY2
});

module.exports = s3;
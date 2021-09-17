const multers3 = require('multer-s3');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_accessKeyId,
    secretAccessKey: process.env.S3_secretAccessKey,
	region: process.env.S3_region,
});

const storageS3 = multers3({
    s3: s3,
    acl: 'public-read',
    bucket: 'spotlighton-storage',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname})
    },
    key: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
      //cb(null, Date.now().toString() + '-' + file.originalname)
    }
  });
  
  

module.exports = storageS3;

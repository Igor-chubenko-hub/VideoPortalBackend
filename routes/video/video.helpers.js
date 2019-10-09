const multer = require('multer');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const { logGenerator } = require('../../logger/logGenerator');
const { Videos } = require('../../models');
const { s3 } = require('../../services/s3.service');

module.exports = {
  upload: multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../tmp'));
      },
      filename: (req, file, cb) => {
        cb(null, `${req.params.id}.${file.originalname.split('.').pop()}`);
      },
    }),
  }),
  uploadStreamToBucket(fileName) {
    const pass = new stream.PassThrough();

    const params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: pass,
    };

    const options = {
      partSize: 10 * 1024 * 1024,
      queueSize: 10,
    };

    s3.upload(params, options, (err, data) => {
      if (err) {
        return logGenerator({ err, message: 'Error in upload to bucket' });
      }
      return Videos.update(
        {
          videoLink: data.Location,
        },
        { where: { id: fileName.split('.').shift() } }
      )
        .then(() => {
          fs.unlink(`${process.cwd()}/tmp/${fileName}`, errUnlink => {
            if (errUnlink)
              logGenerator({
                err: errUnlink,
                message: 'Cant delete local video',
              });
          });
        })
        .catch(errUpdate => {
          logGenerator({ err: errUpdate, message: 'Error in updating' });
        });
    });
    return pass;
  },
  deleteVideo(videoLink) {
    const fileName = videoLink.split('/').pop();
    return new Promise((resolve, reject) => {
      if (videoLink.includes('tmp')) {
        fs.unlink(`${process.cwd()}/tmp/${fileName}`, err => {
          if (err) logGenerator({ err, message: 'Cant delete local video' });
          resolve();
        });
      } else {
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: fileName,
        };

        s3.deleteObject(params, (err, data) => {
          if (err) {
            logGenerator({ err });
            reject(err);
          } else {
            resolve(data);
          }
        });
      }
    });
  },
  downloadFile(key) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    };

    return s3.getObject(params);
  },
};

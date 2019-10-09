const path = require('path');
require('dotenv').config({
  path: path.resolve(`.env.${process.env.NODE_ENV}`),
});
const moment = require('moment');
const fs = require('fs');
const { Videos } = require('../models');
const { logGenerator } = require('../logger/logGenerator');
const { uploadStreamToBucket } = require('../routes/video/video.helpers');

const twelveHoursAsMilliseconds = moment.duration(12, 'hours').asMilliseconds();
const sixHoursAgo = moment.utc().subtract(6, 'hours');

const jobs = [
  async function failedUpload() {
    setTimeout(failedUpload, twelveHoursAsMilliseconds);
    const videos = await Videos.findAll({
      where: {
        $and: [
          {
            createdAt: {
              $lte: sixHoursAgo,
            },
          },
          {
            $or: [
              {
                videoLink: null,
              },
              {
                videoLink: {
                  $iLike: `%${process.env.ORIGIN}%`,
                },
              },
            ],
          },
        ],
      },
    });

    const defaultValue = {
      notFoundedVideos: [],
      notDeployedVideos: [],
    };

    const { notFoundedVideos, notDeployedVideos } = videos
      ? videos.reduce((acc, video) => {
          if (video.videoLink) {
            acc.notDeployedVideos.push(video.id);
          } else {
            acc.notFoundedVideos.push(video.id);
          }
          return acc;
        }, defaultValue)
      : defaultValue;

    if (notFoundedVideos.length) {
      logGenerator({
        message: `Not founded videos with id ${notFoundedVideos.join(',')}`,
      });

      Videos.destroy({
        where: {
          id: {
            $in: [notFoundedVideos],
          },
        },
      }).catch(err => {
        logGenerator({
          err,
          message: 'Error during delete not founded videos',
        });
      });
    }

    if (notDeployedVideos.length) {
      logGenerator({
        message: `Not deployed videos with id ${notDeployedVideos.join(',')}`,
      });

      notDeployedVideos.forEach(videoId => {
        Videos.findOne({
          where: {
            id: videoId,
          },
        })
          .then(({ videoLink }) => {
            const videoName = videoLink.split('stream/').pop();
            const fileStream = fs.createReadStream(
              `${process.cwd()}/tmp/${videoName}`
            );

            fileStream.pipe(uploadStreamToBucket(videoName));
          })
          .catch(err => {
            logGenerator({ err, message: 'Error in find videos to upload!' });
          });
      });
    }
  },
];

jobs.forEach(job => job());

const Sequelize = require('sequelize');
const fs = require('fs');
const { uploadStreamToBucket, deleteVideo } = require('./video.helpers');
const { Videos, Categories, VideosCategories, Users } = require('../../models');

const { Op } = Sequelize;
module.exports = {
  async getVideo(req, res, next) {
    try {
      const { id } = req.params;
      const video = await Videos.findOne({
        include: [
          {
            model: Categories,
            as: 'categories',
            attributes: ['id', 'name', 'color'],
            through: { attributes: [] },
          },
        ],
        where: { id },
      });
      return res.status(200).send(video);
    } catch (err) {
      return next(err);
    }
  },
  async getVideoStream(req, res, next) {
    try {
      const { name } = req.params;
      const format = name.split('.').pop();
      const path = `${process.cwd()}/tmp/${name}`;
      const stat = fs.statSync(path);
      const fileSize = stat.size;
      const { range } = req.headers;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': `video/${format}`,
        };
        res.writeHead(206, head);
        return file.pipe(res);
      }
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      return fs.createReadStream(path).pipe(res);
    } catch (err) {
      return next(err);
    }
  },
  async deleteVideo(req, res, next) {
    try {
      const [{ id }, { id: owner }] = [req.params, req.user];
      const { videoLink } = await Videos.findOne({
        where: {
          id,
          owner,
        },
      });

      await deleteVideo(videoLink);
      await Videos.destroy({
        where: {
          id,
          owner,
        },
      });

      return res.status(200).send(id);
    } catch (err) {
      return next(err);
    }
  },
  async setStatus(req, res, next) {
    try {
      const [{ id }, { status }] = [req.params, req.query];

      await Videos.update({ status }, { where: { id } });

      return res.status(200).send('Uploaded');
    } catch (err) {
      return next(err);
    }
  },
  async uploadFiles(req, res, next) {
    try {
      const [{ id }, { filename }] = [req.params, req.file];

      await Videos.update(
        {
          videoLink: `${process.env.SERVER_NAME}/api/video/stream/${filename}`,
        },
        { where: { id } }
      );
      const fileStream = fs.createReadStream(
        `${process.cwd()}/tmp/${filename}`
      );

      fileStream.pipe(uploadStreamToBucket(filename));

      return res.status(200).send('Uploaded');
    } catch (err) {
      return next(err);
    }
  },
  async storeVideoData(req, res, next) {
    try {
      const {
        body: { title, description, categories, duration },
        user: { id: owner },
      } = req;

      const videoData = {
        owner,
        title,
        description,
        duration,
      };

      const { id } = await Videos.create(videoData);

      await VideosCategories.bulkCreate(
        categories.map(category => ({
          categoryId: category,
          videoId: id,
        }))
      );

      return res.status(200).send({ id });
    } catch (err) {
      return next(err);
    }
  },
  async searchVideo(req, res, next) {
    const limit = 10; // number of records per page
    const { searchValue, page = 0, arrangeValue } = req.query; // page number
    const offset = limit * page;
    Videos.findAll({
      subQuery: false,
      attributes: ['title', 'description', 'createdAt', 'videoLink'],
      where: {
        [Op.and]: [
          { status: 'published' },
          {
            [Op.or]: [
              {
                title: {
                  [Op.iLike]: `%${searchValue}%`,
                },
              },
              {
                description: {
                  [Op.iLike]: `%${searchValue}%`,
                },
              },
              {
                '$categories.name$': {
                  [Op.iLike]: `%${searchValue}%`,
                },
              },
              {
                '$author.username$': {
                  [Op.iLike]: `%${searchValue}%`,
                },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: Categories,
          as: 'categories',
          attributes: ['id', 'name', 'color'],
          through: { attributes: [] },
        },
        {
          model: Users,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
      limit,
      offset,
      order: [
        arrangeValue === 'relevance' ? ['id', 'ASC'] : ['updatedAt', 'DESC'],
      ],
    })
      .then(videos => {
        res.status(200).send({ result: videos });
      })
      .catch(err => next(err));
  },
  async editVideo(req, res, next) {
    const videoUpdate = req.body;
    try {
      const { id } = req.params;
      return await Videos.findOne({
        where: {
          id,
        },
      }).then(video =>
        video.update(videoUpdate).then(() => res.status(200).send(video))
      );
    } catch (err) {
      return next(err);
    }
  },
  filterVideo(req, res, next) {
    const { duration = {}, categories, page = 0 } = req.query;
    const { min, max } = duration;
    const limit = 20; // number of records per page
    const where = {
      status: 'published',
    };
    const categoryFilter = {
      where: {},
    };

    if (categories) {
      categoryFilter.where.id = { [Op.in]: categories };
    }

    if (min && max) {
      where.duration = {
        [Op.and]: [{ [Op.gte]: min }, { [Op.lte]: max }],
      };
    }

    try {
      const offset = limit * page;
      return Videos.findAll({
        subQuery: false,
        attributes: ['id', 'title', 'createdAt', 'videoLink', 'duration'],
        where,
        include: [
          {
            model: Categories,
            as: 'categories',
            attributes: ['id', 'name', 'color'],
            ...categoryFilter,
            through: { attributes: [] },
          },
          {
            model: Users,
            as: 'author',
            attributes: ['id', 'username', 'avatar'],
          },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      }).then(videos => {
        return res.status(200).send({ result: videos });
      });
    } catch (err) {
      return next(err);
    }
  },
  async latestUpload(req, res, next) {
    try {
      const videos = await Videos.findAll({
        limit: 20,
        subQuery: false,
        attributes: ['id', 'title', 'createdAt', 'videoLink'],
        include: [
          {
            model: Categories,
            as: 'categories',
            attributes: ['id', 'name', 'color'],
            through: { attributes: [] },
          },
          {
            model: Users,
            as: 'author',
            attributes: ['id', 'username', 'avatar'],
          },
        ],
        where: {
          status: 'published',
        },
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).send(videos);
    } catch (err) {
      return next(err);
    }
  },
  async userVideos(req, res, next) {
    try {
      const { id } = req.user;
      const videos = await Videos.findAll({
        limit: 20,
        subQuery: false,
        attributes: ['id', 'title', 'createdAt', 'updatedAt', 'videoLink'],
        include: [
          {
            model: Categories,
            as: 'categories',
            attributes: ['id', 'name', 'color'],
            through: { attributes: [] },
          },
          {
            model: Users,
            as: 'author',
            attributes: [],
            where: {
              id,
            },
          },
        ],
      });

      return res.status(200).send(videos);
    } catch (err) {
      return next(err);
    }
  },
  async getCategories(req, res, next) {
    try {
      const categories = await Categories.findAll({
        attributes: ['id', 'name', 'color'],
      });

      return res.status(200).send(categories);
    } catch (err) {
      return next(err);
    }
  },
};

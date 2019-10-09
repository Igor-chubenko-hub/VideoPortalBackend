const Joi = require('joi');

const schemas = {
  validateVideoSchema: Joi.object().keys({
    title: Joi.string()
      .min(5)
      .max(20)
      .required(),
    description: Joi.string()
      .min(5)
      .max(300)
      .required(),
    categories: Joi.array()
      .items(Joi.number())
      .required(),
    duration: Joi.number().required(),
  }),
  validateStatusSchema: Joi.object().keys({
    id: Joi.string().regex(/^\d+/),
    status: Joi.string().regex(/published|uploaded/),
  }),
};

module.exports = {
  validateVideo(req, res, next) {
    const { error } = Joi.validate(req.body, schemas.validateVideoSchema);
    if (error) {
      const message = `${error.name}: ${error.details[0].message}`;
      return res.status(400).send(message);
    }
    return next();
  },
  validateStatus(req, res, next) {
    const [{ id }, { status }] = [req.params, req.query];
    const { error } = Joi.validate(
      { id, status },
      schemas.validateStatusSchema
    );
    if (error) {
      const message = `${error.name}: ${error.details[0].message}`;
      return res.status(400).send(message);
    }
    return next();
  },
};

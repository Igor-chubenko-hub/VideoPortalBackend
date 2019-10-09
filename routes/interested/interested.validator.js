const Joi = require('joi');

const schemas = {
  validateInterested: Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }),
  }),
};

module.exports = {
  validateInterested(req, res, next) {
    const { error } = Joi.validate(req.body, schemas.validateInterested);
    if (error) {
      const message = `${error.name}: ${error.details[0].message}`;
      return res.status(400).send(message);
    }
    return next();
  },
};

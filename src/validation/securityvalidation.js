const joi = require("joi");

const createUserRegistration = (req, res, next) => {
  const schema = joi.object().keys({
    userName: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    emailId: joi.string().required(),
    phoneNumber: joi.string().required(),
    DOB: joi.string().required(),
    password: joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
const loginValidation = (req, res, next) => {
  const schema = joi.object({
    emailId: joi.string().required(),
    password: joi.string().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
module.exports = { createUserRegistration, loginValidation };

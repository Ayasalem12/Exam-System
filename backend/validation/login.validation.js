const Joi = require("joi");

exports.loginSchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

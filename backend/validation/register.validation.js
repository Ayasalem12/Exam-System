const Joi = require("joi");

exports.registerSchema = Joi.object({
  username: Joi.string().trim().min(1).required().messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
  }),

  email: Joi.string()
    .pattern(/^[a-zA-Z]{3,10}@(gmail|yahoo)\.com$/)
    .required()
    .messages({
      "any.required": "Email is required",
      "string.pattern.base":
        "Email must be in the format example@gmail.com or example@yahoo.com",
    }),

  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),

  role: Joi.string().valid("student", "admin").optional(),
});

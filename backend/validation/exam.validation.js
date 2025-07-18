const Joi = require("joi");

exports.createExamSchema = Joi.object({
  title: Joi.string().trim().required().min(1).messages({
    "any.required": "Title is required",
    "string.empty": "Title cannot be empty",
  }),

  description: Joi.string().allow("").optional(),

  duration: Joi.number().integer().min(1).required().messages({
    "any.required": "Duration is required",
    "number.base": "Duration must be a number in minutes",
    "number.min": "Duration must be at least 1 minute",
  }),
  createdBy: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "any.required": "CreatedBy is required",
      "string.pattern.base": "CreatedBy must be a valid ObjectId",
    }),
});

exports.updateExamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "ID must be a valid ObjectId",
    }),
  title: Joi.string().trim().min(1).optional().messages({
    "string.empty": "Title cannot be empty",
  }),
  description: Joi.string().allow("").optional(),
  duration: Joi.number().integer().min(1).optional().messages({
    "number.base": "Duration must be a number in minutes",
    "number.min": "Duration must be at least 1 minute",
  }),
  createdBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "CreatedBy must be a valid ObjectId",
    }),
}).unknown(false);

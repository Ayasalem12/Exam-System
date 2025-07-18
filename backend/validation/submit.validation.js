const Joi = require('joi');
const mongoose = require('mongoose');

const submitSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        }, 'ObjectId validation').required(),
        answer: Joi.alternatives()
          .try(Joi.string(), Joi.array().items(Joi.string()))
          .required()
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Answers must be an array',
      'any.required': 'Answers are required',
      'array.min': 'At least one answer is required'
    })
});

module.exports = { submitSchema };
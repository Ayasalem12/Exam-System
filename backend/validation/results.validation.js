const Joi = require('joi');
const mongoose = require('mongoose');
const submitAnswersSchema = Joi.object({
    answers: Joi.array()
      .items(
        Joi.object({
          questionId: Joi.string()
            .custom((value, helpers) => {
              if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
              }
              return value;
            }, 'ObjectId validation')
            .required()
            .messages({
              'any.invalid': 'Question ID must be a valid ObjectId',
              'any.required': 'Question ID is required',
            }),
          answer: Joi.string().trim().required().messages({
            'string.empty': 'Answer is required',
            'any.required': 'Answer is required',
          }),
        })
      )
      .required()
      .messages({
        'array.base': 'Answers must be an array',
        'any.required': 'Answers are required',
      }),
  });
  const answerSubmitSchema = submitAnswersSchema;
  module.exports = { answerSubmitSchema};

// validation/questions.validation.js
const Joi = require('joi');
const mongoose = require('mongoose');
// Custom validation to ensure answer is one of the choices
const answerMustBeInChoices = (value, helpers) => {
    const { choices } = helpers.state.ancestors[0]; // Access choices from the parent object
    if (!choices.includes(value)) {
      return helpers.error('answer.invalid');
    }
    return value;
};
const questionSchema = Joi.object({
    examId: Joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation')
    .required()
    .messages({
      'any.invalid': 'Exam ID must be a valid ObjectId',
      'any.required': 'Exam ID is required',
    }),
    questionDesc: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.min': 'Description must be at least 5 characters',
      'string.max': 'Description cannot exceed 500 characters',
      'string.empty': 'Description is required',
      'any.required': 'Description is required',
    }),
  choices: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(2)
    .required()
    .messages({
      'array.min': 'Choices must contain at least 2 options',
      'array.base': 'Choices must be an array',
      'any.required': 'Choices are required',
      'string.empty': 'Choice cannot be empty',
    }),
  answer: Joi.string()
    .trim()
    .required()

    .custom(answerMustBeInChoices, 'Answer must be of the choices')

    .custom(answerMustBeInChoices, 'Answer must be one of the choices')

    .messages({
      'string.empty': 'Answer is required',
      'any.required': 'Answer is required',
      'answer.invalid': 'Answer must be one of the provided choices',
    }),

  //   answer: Joi.array()
  //   // .items(Joi.string().valid(...Joi.ref('choices'))) 
  //   .items(Joi.string()) 
  //   .min(1)
  //   .when('isMultiple', {
  //     is: false,
  //     then: Joi.array().max(1), // Single answer 
  //     otherwise: Joi.array().min(1), // Multiple answers 
  //   })
  //   .required()
  //   .messages({
  //     'array.empty': 'Answer is required',
  //     'any.required': 'Answer is required',
  //     'answer.invalid': 'Answer must be one of the provided choices',
  //   }),
  // isMultiple: Joi.boolean().required(),

  score: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.min': 'Weight must be at least 1',
      'number.base': 'Weight must be a number',
      'any.required': 'Weight is required',
    }),
  });
  
  const createQuestionSchema = questionSchema;
  const updateQuestionSchema = questionSchema.fork(['examId', 'questionDesc', 'choices', 'answer', 'score'], field => field.optional());
//   const updateQuestionSchema = questionSchema;

module.exports = { createQuestionSchema, updateQuestionSchema };
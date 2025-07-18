const mongoose = require("mongoose");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const questionsModel = require("../models/questions");
const Exam = require("../models/exam");

exports.getQuestions = catchAsync(async (req, res, next) => {
  const { examId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    return next(new AppError(400, "Invalid exam ID format"));
  }
  let exam = await Exam.findById(examId);
  if (!exam) {
    return next(new AppError(404, "Exam is not found"));
  }
  let questions = await questionsModel
    .find({ examId })
    .populate("examId")
    .populate("userId");
  res
    .status(200)
    .json({ message: "Success fetching questions", data: questions });
});

exports.save = catchAsync(async (req, res, next) => {
  const { examId } = req.params;
  const { questionDesc, choices, answer, score } = req.body;

  if (!mongoose.Types.ObjectId.isValid(examId)) {
    return next(new AppError(400, "Invalid exam ID"));
  }

  const exam = await Exam.findById(examId);
  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }

  if (!questionDesc || !choices || !answer || !score) {
    return next(
      new AppError(
        400,
        "Question description, choices, answer, and score are required"
      )
    );
  }

  if (!Array.isArray(choices) || choices.length < 2) {
    return next(new AppError(400, "At least two choices are required"));
  }

  // Validate answer: must be an array with exactly one element
  //   if (!Array.isArray(answer) || answer.length !== 1) {
  //     return next(new AppError(400, 'Answer must be an array with exactly one element'));
  //   }

  const question = new questionsModel({
    examId,
    questionDesc,
    choices,
    answer, // Already an array with one element
    score,
  });

  await question.save();
  res
    .status(201)
    .json({ message: "Question created successfully", data: question });
});

exports.update = catchAsync(async (req, res, next) => {
  const { examId, id } = req.params;
  const { questionDesc, choices, answer, score } = req.body;

  console.log("Request params:", { examId, id });
  console.log("Request body:", req.body);

  if (!mongoose.Types.ObjectId.isValid(examId)) {
    return next(new AppError(400, "Invalid exam ID"));
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(400, "Invalid question ID"));
  }

  const exam = await Exam.findById(examId);
  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }

  const question = await questionsModel.findById(id);
  if (!question) {
    return next(new AppError(404, "Question not found"));
  }

  if (questionDesc) question.questionDesc = questionDesc;
  if (choices) {
    if (!Array.isArray(choices) || choices.length < 2) {
      return next(new AppError(400, "At least two choices are required"));
    }
    question.choices = choices;
  }
  if (answer) {
    if (typeof answer !== "string") {
      return next(new AppError(400, "Answer must be a string"));
    }
    question.answer = answer;
  }
  if (score !== undefined) question.score = score;

  await question.save();
  res
    .status(200)
    .json({ message: "Question updated successfully", data: question });
});

exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid({ id })) {
    return next(new AppError(400, "Invalid question ID"));
  }

  const question = await questionsModel.findByIdAndDelete(id);
  if (!question) {
    return next(new AppError(404, "Question not found"));
  }

  res.status(200).json({ message: "Question deleted successfully" });
});

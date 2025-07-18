const Exam = require("../models/exam");
const User = require("../models/user");
const questionsModel = require("../models/questions");
const resultsModel = require("../models/results");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");
const { catchAsync } = require("../utils/catchAsync");

exports.createExam = catchAsync(async (req, res, next) => {
  const { title, description, duration } = req.body;
  if (!title || !duration) {
    return next(new AppError(400, "Title and duration are required", "fail"));
  }
  const exam = await Exam.create({
    title,
    description,
    duration,
    createdBy: req.id,
  });
  if (!exam) {
    return next(new AppError(400, "Failed to create exam", "fail"));
  }
  res.status(201).json({
    status: "success",
    data: exam,
  });
});

exports.listAllExams = async (req, res, next) => {
  let exams = [];
  if (req.role === "admin") {
    exams = await Exam.find({ createdBy: req.id });
  } else {
    exams = await Exam.find();
  }
  if (!exams || exams.length === 0) {
    return next(new AppError(404, "No exams found", "fail"));
  }
  res.status(200).json({
    status: "success",
    data: exams,
  });
};

exports.updateExam = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, duration } = req.body;
  if (!title || !duration) {
    return next(new AppError(400, "Title and duration are required", "fail"));
  }
  const exam = await Exam.findByIdAndUpdate(id, {
    title,
    description,
    duration,
  });
  if (!exam) {
    return next(new AppError(404, "Exam not found", "fail"));
  }
  res.status(200).json({
    status: "success",
    data: exam,
  });
});

exports.deleteExam = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findByIdAndDelete(id);
  if (!exam) {
    return next(new AppError(404, "Exam not found", "fail"));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getExamById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findById(id);
  if (!exam) {
    return next(new AppError(404, "Exam not found", "fail"));
  }
  res.status(200).json({
    status: "success",
    data: exam,
  });
});

exports.submit = catchAsync(async (req, res, next) => {
  const { answers, examId, userId } = req.body;
  console.log(examId);
  // Validate user
  const user = await User.findById(userId);
  console.log("User Id", userId);
  if (!user) {
    return next(new AppError(404, "User not found"));
  }

  // Validate exam
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    return next(new AppError(400, "Invalid exam ID"));
  }
  const exam = await Exam.findById(examId);
  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }
  if (exam.deadline && new Date() > exam.deadline) {
    return next(new AppError(400, "Exam submission deadline has passed"));
  }

  // Fetch questions for exam
  const questions = await questionsModel.find({ examId });
  if (!questions.length) {
    return next(new AppError(404, "No questions found for this exam!"));
  }

  // Validate answers
  if (!answers || !Array.isArray(answers)) {
    return next(new AppError(400, "Answers must be an array"));
  }
  if (answers.length !== questions.length) {
    return next(
      new AppError(
        400,
        `Please answer all ${questions.length} questions. Only ${answers.length} answers provided.`
      )
    );
  }
  // Prevent duplicate submissions
  // const existingResult = await resultsModel.findOne({ examId, userId });
  // if (existingResult) {
  //     return next(new AppError(400, 'You have already submitted this exam'));
  // }
  // Calculate score
  let totalScore = 0;
  const questionScore = 10;
  const validAnswers = answers.map((answer) => {
    const validQuestion = questions.find(
      (question) => question._id.toString() === answer.questionId
    );
    if (!validQuestion) {
      throw new AppError(
        400,
        `Question ID ${answer.questionId} not found in this exam`
      );
    }
    if (validQuestion.answer === answer.answer) {
      totalScore += questionScore;
    }
    return { questionId: answer.questionId, answer: answer.answer };
  });

  // Save results
  const result = new resultsModel({
    examId,
    userId,
    answers: validAnswers,
    score: totalScore,
  });
  await result.save();

  res.status(201).json({ message: "Exam submitted successfully!", result });
});

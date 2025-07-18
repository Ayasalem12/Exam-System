const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middleware/auth");
const { validation } = require("../middleware/validation");
const {
  getQuestions,
  save,
  update,
  deleteQuestion,
} = require("../controllers/questions");
const {
  createQuestionSchema,
  updateQuestionSchema,
} = require("../validation/questions.validation");

// GET / - Fetch all questions

router.get("/:examId/allquestions", auth, restrictTo("admin","student"), getQuestions);

// POST /:examId/question
router.post(
  "/:examId/question",
  auth,
  restrictTo("admin"),
  save
);

// PATCH  admin/exams/:examId/question/:id - Update a question
router.patch(
  "/:examId/question/:id",
  auth,
  restrictTo("admin"),
  validation(updateQuestionSchema),
  update
);

// DELETE admin/exams/:examId/question/:id - Delete a question

router.delete(
  "/:examId/question/:id",
  auth,
  restrictTo("admin"),
  deleteQuestion
);

module.exports = router;

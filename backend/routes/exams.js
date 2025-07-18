const express = require("express");
const {
  submit,
  createExam,
  listAllExams,
  updateExam,
  deleteExam,
  getExamById,
} = require("../controllers/exams");
const { restrictTo, auth } = require("../middleware/auth");
const {
  createExamSchema,
  updateExamSchema,
} = require("../validation/exam.validation");
const { validation } = require("../middleware/validation");
const router = express.Router();
const { answerSubmitSchema } = require("../validation/results.validation");
const {submitSchema} = require("../validation/submit.validation")

router.post(
  "/createexam",
  auth,
  restrictTo("admin"),
  validation(createExamSchema),
  createExam
);
router.get("/", auth, listAllExams);
router.get("/getexam/:id", auth, restrictTo("admin"), getExamById);
router.patch(
  "/updateexam/:id",
  auth,
  restrictTo("admin"),
  validation(updateExamSchema),
  updateExam
);
router.delete("/deleteexam/:id", auth, restrictTo("admin"), deleteExam);
router.post(
  "/:examId/submit",
  auth,
  restrictTo("student"),
  submit
);

module.exports = router;

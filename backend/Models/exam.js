const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      unique: true,
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: (props) => `${props.value} is not a valid title!`,
      },
    },
    description: {
      type: String,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;

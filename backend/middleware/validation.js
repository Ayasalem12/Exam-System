exports.validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    console.log(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }

    next();
  };
};

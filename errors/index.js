
exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.otherErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  let codes = ["22P02", "23502", "42703"];
  if (codes.includes(err.code)) {
    res.status(400).send({ message: "Bad Request" });
  } else next(err);
};

exports.otherPsqlErrors = (err, req, res, next) => {
  let codes = ["23503"];
  if (codes.includes(err.code)) {
    res.status(404).send({ message: "Not Found" });
  } else next(err);
};
const express = require("express");
const apiRouter = require("./routes/api");
const { routeNotFound, handle500 } = require("./errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);

app.use((err, req, res, next) => {
  if (err.status === 404) {
   res.status(404).send({msg: "Not Found"})
  } else next(err);
});

app.use((err, req, res, next) => {
  const psqlCodes = ["22P02"];
  if (psqlCodes.includes(err.code))
    res.status(400).send({ msg: "Bad Request" });
  else next(err);
});

app.use(handle500);

module.exports = app;

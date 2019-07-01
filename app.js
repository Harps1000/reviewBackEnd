const express = require("express");
const apiRouter = require("./routes/api");
const { routeNotFound, handle500, otherErrors, psqlErrors, otherPsqlErrors } = require("./errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);

app.use(otherErrors);

app.use(psqlErrors);

app.use(otherPsqlErrors);

app.use(handle500);

module.exports = app;
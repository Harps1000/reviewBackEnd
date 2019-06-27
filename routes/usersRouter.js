const usersRouter = require('express').Router();
const getAuser = require("../controllers/userControllers")


usersRouter
  .route('/:username')
  .get(getAuser)


module.exports = usersRouter
const topicsRouter = require('express').Router();
const fetchAllTopics = require("../controllers/topicsControllers")


topicsRouter
  .route('/')
  .get(fetchAllTopics)




module.exports = topicsRouter
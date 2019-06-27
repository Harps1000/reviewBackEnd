const articlesRouter = require('express').Router();
const {getArticlesById, updateArticleVotes, getArticles} = require("../controllers/articlesControllers")


articlesRouter
  .route('/:article_id')
  .get(getArticlesById)
  .patch(updateArticleVotes)

articlesRouter
  .route('/')
  .get(getArticles)


module.exports = articlesRouter;
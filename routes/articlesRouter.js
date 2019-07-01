const articlesRouter = require('express').Router();
const {getArticlesById, updateArticleVotes, getArticles} = require("../controllers/articlesControllers")

const {
  postCommentController,
  getCommentsByArticleID
} = require("../controllers/commentsControllers");

articlesRouter
  .route('/:article_id')
  .get(getArticlesById)
  .patch(updateArticleVotes)

articlesRouter
  .route('/')
  .get(getArticles)

  articlesRouter
  .route("/:article_id/comments")
  .post(postCommentController)
  .get(getCommentsByArticleID)


module.exports = articlesRouter;
const articlesRouter = require('express').Router();
const {getArticlesById, updateArticleVotes, getArticles} = require("../controllers/articlesControllers")

const {
  postComments,
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
  .post(postComments)
  .get(getCommentsByArticleID)


module.exports = articlesRouter;
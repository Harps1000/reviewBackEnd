const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  updateCommentVotes,
  deleteComments
} = require("../controllers/commentsControllers");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentVotes)
  .delete(deleteComments)
  .all(methodNotAllowed);

module.exports = commentsRouter;
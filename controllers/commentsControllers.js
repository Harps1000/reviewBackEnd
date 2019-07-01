const {
    postingComment,
    getingCommentsByArticleID,
    updateCommentVote,
    deleteComment
  } = require("../models/commentsModels");
  
  
  
  exports.getCommentsByArticleID = (req, res, next) => {
    getingCommentsByArticleID(req.query, req.params)
      .then(result => {
        if (result.length === 0) {
          return Promise.reject({ message: "Not Found", status: 404 });
        }
        res.status(200).send({ comments: result });
      })
      .catch(next);
  };
  
  exports.updateCommentVotes = (req, res, next) => {
    if (!req.body.inc_votes) {
      next({ message: "Incorrect Key", status: 400 });
      return;
    }
    updateCommentVote(req.body, req.params)
      .then(result => {
        if (result.length === 0) {
          return Promise.reject({ message: "Not Found", status: 404 });
        }
        res.status(200).send({ comment: result[0] });
      })
      .catch(next);
  };
  
  exports.deleteComments = (req, res, next) => {
    deleteComment(req.params)
      .then(result => {
        if (result.length === 0) {
          return Promise.reject({ message: "Not Found", status: 404 });
        } else {
          res.sendStatus(204);
        }
      })
      .catch(next);
  };

  exports.postComments = (req, res, next) => {
    postingComment(req.body, req.params)
      .then(result => {
        res.status(201).send({ comment: result[0] });
      })
      .catch(next);
  };
const connection = require("../db/connection");



exports.getingCommentsByArticleID = (query, { article_id }) => {
  let sorting = query.sort_by || "created_at";
  let ordering = query.order || "desc";
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where("article_id", "=", article_id)
    .orderBy(sorting, ordering);
}; 

exports.postingComment = ( body , { article_id }) => {
  let comm = { ...body };
  let comment = {}
  
  comment.author = comm.username;
  
  comment.article_id = article_id;
  comment.created_at = new Date(Date.now());
  
  return connection("comments")
    .insert(comment)
    .returning("*");
};

exports.deleteComment = ({ comment_id }) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .returning("*");
};

exports.updateCommentVote = ({ inc_votes }, { comment_id }) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*");
};


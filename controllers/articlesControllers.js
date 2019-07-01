const {
  fetchArticleById,
  patchArticleVotes,
  getAllArticles
} = require("../models/articleModels");

exports.getArticles = (req, res, next) => {
  getAllArticles(req.query)
  .then(result => {
    if (result.length === 0) {
      return Promise.reject({
        message: "Not Found",
        status: 404
      });
    } else {
      res.send({ Articles: result});
    }
  })
  .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(([article]) => {
    if (!article) return Promise.reject({ message:"Not Found", status: 404 });
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVotes = (req, res, next) => {
  patchArticleVotes(req.params, req.body).then(([article]) =>
        res.send({article})
  ).catch(next)
};


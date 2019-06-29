const {
  fetchArticleById,
  patchArticleVotes,
  getAllArticles
} = require("../models/articleModels");

exports.getArticlesById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404 });
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVotes = (req, res, next) => {
  patchArticleVotes(req.params, req.body).then(([article]) =>
        res.send({article})
  ).catch(next)
};

exports.getArticles = (req, res, next) => {
  console.log("hereeeeeee")
  getAllArticles(req.query)
  .then(result => {
  res.send(result)
  }).catch(console.log)
    }
    

// module.exports = { getArticlesById, updateArticleVotes};

const {
  fetchArticleById,
  patchArticleVotes,
  fetchAllArticles
} = require("../models/articleModels");

const getArticlesById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(([article]) => {
      if (!article) return Promise.reject({ status: 404 });
      res.status(200).send({ article });
    })
    .catch(next);
};

const updateArticleVotes = (req, res, next) => {
  patchArticleVotes(req.params, req.body).then(([article]) =>
        res.send({article})
  ).catch(next)
};

const getArticles = (req, res, next) => {
  fetchAllArticles()
}

module.exports = { getArticlesById, updateArticleVotes, getArticles};

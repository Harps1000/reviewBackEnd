const commentsRouter = require('express').Router();


commentsRouter
  .route('/')
  .get((req, res) => res.send({ ok: true }))



module.exports = commentsRouter;
const fetchAuser = require("../models/userModels");

const getAuser = (req, res, next) => {
  fetchAuser(req.params)
    .then(([user]) => {
      if (!user) return Promise.reject({ message: "Not Found", status: 404 });
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = getAuser;

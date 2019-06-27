const { articles, comments, topics, users } = require("../data/index");

const { createDate, createRef, formatData, formatData2 } = require("../../utils/utils");

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics").insert(topics, ["*"]);
    })
    .then(() => {
      return knex("users").insert(users, ["*"]);
    })
    .then(() => {
      const data = createDate(articles);
      return knex("articles").insert(data, ["*"]);
    })
    .then(articles => {
      const refobj = createRef(articles, "title", "article_id");
      //(dataToConvert, referenceObj, keyToReject, newKey)
      const finaldata = formatData(
        comments,
        refobj,
        "belongs_to",
        "article_id"
      );
      const dataToInsert = createDate(finaldata);
     const sData = formatData2(dataToInsert,"created_by", "author");

     return knex("comments").insert(sData, ["*"]);
    });
};

exports.up = function(knex, Promise) {
 
  return knex.schema.createTable("articles", art => {
    art.increments("article_id").primary();
    art.string("title");
    art.text("body");
    art.integer("votes").defaultTo(0);
    art.string("topic").references("topics.slug");
    art.string("author").references("users.username");
    art.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
 
  return knex.schema.dropTable("articles");
};

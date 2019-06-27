exports.up = function(knex, Promise) {
  
    return knex.schema.createTable("comments", com => {
      com.increments("comment_id").primary();
      com.string("author").references("users.username");
      com.integer("article_id").references("articles.article_id");
      com.integer("votes").defaultTo(0);
      com.timestamp("created_at").defaultTo(knex.fn.now());
      com.text("body");
    });
  };
  
  exports.down = function(knex, Promise) {
    
    return knex.schema.dropTable("comments");
  };
  
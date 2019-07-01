process.env.NODE_ENV = "test";

const { expect } = require("chai");
const chai = require("chai")
const request = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

chai.use(require("chai-sorted"));

describe("/", function() {
  this.timeout(80000);
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("GET /api", () => {
    it("GET status:200", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
  });

  describe("GET /api/topics", () => {
    it("Responds with an array of topic objects, correct properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an("array");
          expect(body.topics).to.have.length(3)
          expect(body.topics[0]).to.contain.keys("slug", "description");
        });
    });
  });



  describe("GET /api/users/:username", () => {
    it("Responds with correct User Object info", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.eql({
            username: "lurker",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            name: "do_nothing"
          });
        });
    });
    it("Error Handling.  GET status:404 not found when requesting a non-existent username", () => {
      return request(app)
        .get("/api/users/random")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).to.equal("Not Found");
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
     it("Responds with an article objects, correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).to.eql({ article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 100,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: '2018-11-15T12:21:54.171Z',
            comment_count: '13' })
        });
    });
    it("Error Handling. GET status:400 article by ID with a non-existent, non-integer ID", () => {
      return request(app)
        .get("/api/articles/jj")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.eql("Bad Request");
        });
    });
    it("Error Handling. GET status:404 article by ID with an ID that does not exist", () => {
      return request(app)
        .get("/api/articles/98333")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).to.eql("Not Found");
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    it("Request body accepts a vote object and returns updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -2 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 98,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z"
          });
        });
      })
      it("bad request expecting 400 and err message", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "catula" })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.eql("Bad Request");
          });
      });
      it("Some other property on request body should be ignored", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 3, name: "catula" })
          .expect(200)
          });
      });
    
   
    describe("POST /api/articles/:article_id/comments", () => {
      it("status:201, successfully added the supplied comment to database and returns it", () => {
        return request(app)
          .post("/api/articles/6/comments")
          .send({ username: "butter_bridge", body: "adding a comment" })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).to.have.all.keys(
              "comment_id",
              "author",
              "article_id",
              "body",
              "votes",
              "created_at"
            );
          });
      });
      it("status:400 when article_id invalid", () => {
        return request(app)
          .post("/api/articles/string/comments")
          .send({ username: "butter_bridge", body: "fail" })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal("Bad Request");
          });
      });
      it("status:404 when article_id nonexistent", () => {
        return request(app)
          .post("/api/articles/657/comments")
          .send({ username: "butter_bridge", body: "fail" })
          .expect(404)
          .then(({ body }) => {
            expect(body).to.eql({ message: "Not Found" });
          });
      });
    });
  
    describe("GET /api/articles/:article_id/comments", () => {
      it("status:200, successfully responds with all the correct comments for specified article, with default order of descending", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .then(({ body }) => {
            expect(body.comments).to.have.length(13);
            expect(body.comments[3]).to.have.all.keys(
              "comment_id",
              "author",
              "body",
              "votes",
              "created_at"
            );
            expect(body.comments).to.be.descendingBy("created_at");
          });
      });
      it("succesfully implements the sort_by and order queries", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
          .expect(200)
            .then(({ body }) => {
            expect(body.comments).to.have.length(13);
            expect(body.comments[3]).to.have.all.keys(
              "comment_id",
              "author",
              "body",
              "votes",
              "created_at"
            );
            expect(body.comments).to.be.ascendingBy("comment_id");
          });
      });
      it("status:404, custom error when article_id nonexistent", () => {
        return request(app)
          .get("/api/articles/666/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body).to.eql({ message: "Not Found" });
          });
      });
      it("status:400 when article_id invalid", () => {
        return request(app)
          .get("/api/articles/NotAnInt/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal("Bad Request");
          });
      });
      it("status:400 when when sort_by set to non-existent column", () => {
        return request(app)
          .get("/api/articles/5/comments?sort_by=notAColumn&order=asc")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal("Bad Request");
          });
      });
    });
  
    describe("GET /api/articles", () => {
      it("status:200, successfully responds with all articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.Articles).to.have.length(12);
            expect(body.Articles[2]).to.have.all.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
            expect(body.Articles[11]).to.eql({
              article_id: 12,
              title: "Moustache",
              body: "Have you seen the size of that thing?",
              votes: 0,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "1974-11-26T12:21:54.171Z",
              comment_count: "1"
            });
          });
      });
      it("successfully sorts and orders by if given the corresponding queries", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.Articles).to.have.length(12);
            expect(body.Articles[2]).to.have.all.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
            expect(body.Articles).to.be.ascendingBy("title");
          });
      });
      it("successfully filters the results if given the corresponding queries", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=asc&author=rogersop&topic=cats")
          .expect(200)
          .then(({ body }) => {
            expect(body.Articles).to.have.length(1);
            expect(body.Articles[0]).to.have.all.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
            expect(body.Articles).to.be.ascendingBy("title");
            expect(body.Articles[0].topic).to.equal("cats");
            expect(body.Articles[0].author).to.equal("rogersop");
          });
      });
      it("status:400 when when sort_by set to non-existent column", () => {
        return request(app)
          .get("/api/articles?sort_by=notAColumn&order=asc")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal("Bad Request");
          });
      });
      it("status:404 when when author set to non-existent author", () => {
        return request(app)
          .get("/api/articles?author=iDontWrite&order=asc")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).to.equal("Not Found");
          });
      });
      it("status:404 when when topic set to non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=iAmNotWrittenAbout&order=asc")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).to.equal("Not Found");
          });
      });
    });
  
    describe("PATCH /api/comments/:comment_id", () => {
      it("status:200, succesfully updates specified comment votes and responds with updated comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(26);
          });
      });
      it("status:404, custom error when article_id nonexistent", () => {
        return request(app)
          .patch("/api/comments/711")
          .send({ inc_votes: 10 })
          .expect(404)
          .then(({ body }) => {
            expect(body).to.eql({ message: "Not Found" });
          });
      });
      it("status:400 when article_id invalid", () => {
        return request(app)
          .patch("/api/comments/notAnInt")
          .send({ inc_votes: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal("Bad Request");
          });
      });
      it("status:400, responds with custom error when request body has invalid key or value", () => {
        return request(app)
          .patch("/api/comments/10")
          .send({ invalid_key: "notAnInt" })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal("Incorrect Key");
          });
      });
      it("status:400, responds with custom error when request body non-existent", () => {
        return request(app)
          .patch("/api/comments/2")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal("Incorrect Key");
          });
      });
      it("status:400 when value of inc_votes is not an integer", () => {
        return request(app)
          .patch("/api/comments/3")
          .send({ inc_votes: "string" })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal("Bad Request");
          });
      });
    });
  
    describe("DELETE /api/comments/:comment_id", () => {
      it("Responds with status 204 and no content", () => {
        return request(app)
          .delete("/api/comments/2")
          .expect(204);
      });
      it("Error Handling: status:404 not found when requesting a non-existent comment ID", () => {
        return request(app)
          .delete("/api/comments/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body).to.eql({ message: "Not Found" });
          });
      });
      it("Error Handling: status:400 Bad Request when requesting a non integer comment ID", () => {
        return request(app)
          .delete("/api/comments/Random")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal("Bad Request");
          });
      });
    });
  })
  
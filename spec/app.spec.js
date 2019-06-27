process.env.NODE_ENV = "test";

const { expect } = require("chai");
const request = require("supertest");

const app = require("../app");
const connection = require("../db/connection");

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
          expect(body.topics[0]).to.contain.keys("slug", "description");
        });
    });
  });

  describe("GET /api/users/:username", () => {
    it("Sends an empty object, with a key name", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).that.be.an("object");
        });
    });
    it("Responds with a user object, correct properties", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.contain.keys("username", "avatar_url", "name");
        });
    });
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
          expect(body.msg).to.equal("Not Found");
        });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    it("Sends an empty object, with a key name", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });

    it("Responds with an article objects, correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.contain.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          );
        });
    });

    it("Error Handling. GET status:400 article by ID with a non-existent, non-integer ID", () => {
      return request(app)
        .get("/api/articles/jj")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("Bad Request");
        });
    });
    it("Error Handling. GET status:404 article by ID with an ID that does not exist", () => {
      return request(app)
        .get("/api/articles/98333")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("Not Found");
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
            expect(body.msg).to.eql("Bad Request");
          });
      });
      it("Some other property on request body should be ignored", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 3, name: "catula" })
          .expect(200)
          });
      });
    })

  //   describe("POST /api/articles/:article_id/comments", () => {
  //     it("Sends an empty object, with a key name", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //     it("test 2", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //     it("test 3", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //   });

  //   describe("GET /api/articles/:article_id/comments", () => {
  //     it("Sends an empty object, with a key name", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //     it("test 2", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //     it("test 3", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //   });

    describe("GET /api/articles", () => {
      it("Sends an empty object, with a key name", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.ok).to.equal(true);
          });
      });
      it("test 2", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body.ok).to.equal(true);
          });
      });
      it("test 3", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body.ok).to.equal(true);
          });
      });
    });

  //   describe("PATCH /api/comments/:comment_id", () => {
  //     it("Sends an empty object, with a key name", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //     it("test 2", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //     it("test 3", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //   });

  //   describe("DELETE /api/comments/:comment_id", () => {
  //     it("Sends an empty object, with a key name", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //     it("test 2", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //     it("test 3", () => {
  //       return request(app)
  //         .get("/api")
  //         .expect(200)
  //         .then(({ body }) => {
  //           expect(body.ok).to.equal(true);
  //         });
  //     });
  //   });

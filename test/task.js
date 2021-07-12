const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

//assertion style
chai.should();

chai.use(chaiHttp);

describe("Tasks API", () => {
  /*
  test GET
  * */
  describe("GET api/tasks", () => {
    it("It should GET all tasks", (done) => {
      chai
        .request(server)
        .get("/api/tasks")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          response.body.length.should.be.eq(3);
          done();
        });
    });

    it("It should NOT GET all tasks (wrong API)", (done) => {
      chai
        .request(server)
        .get("/api/task")
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  /*
  test GET by ID
  * */
  describe("GET /api/tasks/:id", () => {
    it("It should GET a task by ID", (done) => {
      const taskId = 1;
      chai
        .request(server)
        .get("/api/tasks/" + taskId)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("id");
          response.body.should.have.property("name");
          response.body.should.have.property("completed");
          response.body.should.have.property("id").eq(1);
          done();
        });
    });

    it("It should NOT GET a task by ID (Wrong ID)", (done) => {
      const taskId = 12345;
      chai
        .request(server)
        .get("/api/tasks/" + taskId)
        .end((err, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            "The task with the provided ID does not exist."
          );
          done();
        });
    });
  });
  /*
  test POST
  * */
  describe("POST /api/tasks", () => {
    it("It should POST a new task", (done) => {
      const task = {
        name: "Task 4",
        completed: false,
      };
      chai
        .request(server)
        .post("/api/tasks/")
        .send(task)
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a("object");
          response.body.should.have.property("id").eq(4);
          response.body.should.have.property("name").eq("Task 4");
          response.body.should.have.property("completed").eq(false);
          done();
        });
    });

    it("It should not POST a new task with a name", (done) => {
      const task = {
        completed: false,
      };
      chai
        .request(server)
        .post("/api/tasks/")
        .send(task)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "The name should be at least 3 chars long!"
          );

          done();
        });
    });
  });
  /*
  test PUT
  * */
  describe("PUT /api/tasks", () => {
    it("It should PUT an existing task", (done) => {
      const taskId = 1;
      const task = {
        name: "Task 1 changed",
        completed: true,
      };
      chai
        .request(server)
        .put("/api/tasks/" + taskId)
        .send(task)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("id").eq(1);
          response.body.should.have.property("name").eq("Task 1 changed");
          response.body.should.have.property("completed").eq(true);
          done();
        });
    });

    it("It should not PUT an existing task (name too short)", (done) => {
      const taskId = 1;
      const task = {
        name: "Ta",
        completed: true,
      };
      chai
        .request(server)
        .put("/api/tasks/" + taskId)
        .send(task)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "The name should be at least 3 chars long!"
          );
          done();
        });
    });

    it("It should not PUT an existing task (no name)", (done) => {
      const taskId = 1;
      const task = {
        completed: true,
      };
      chai
        .request(server)
        .put("/api/tasks/" + taskId)
        .send(task)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "The name should be at least 3 chars long!"
          );
          done();
        });
    });

    it("It should NOT PUT an existing task (wrong ID)", (done) => {
      const taskId = 1123;
      const task = {
        name: "Task 123",
        completed: true,
      };
      chai
        .request(server)
        .put("/api/tasks/" + taskId)
        .send(task)
        .end((err, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            "The task with the provided ID does not exist."
          );
          done();
        });
    });
  });
  /*
  test PATCH
  * */
  describe("PATCH /api/tasks", () => {
    it("It should PATCH an existing task", (done) => {
      const taskId = 1;
      const task = {
        name: "Task 1 patched",
      };
      chai
        .request(server)
        .patch("/api/tasks/" + taskId)
        .send(task)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("id").eq(1);
          response.body.should.have.property("name").eq("Task 1 patched");
          response.body.should.have.property("completed").eq(true);
          done();
        });
    });

    it("It should not PATCH an existing task (name too short)", (done) => {
      const taskId = 1;
      const task = {
        name: "Ta",
      };
      chai
        .request(server)
        .patch("/api/tasks/" + taskId)
        .send(task)
        .end((err, response) => {
          response.should.have.status(400);
          response.text.should.be.eq(
            "The name should be at least 3 chars long!"
          );
          done();
        });
    });
  });
  /*
  test DELETE
  * */

  describe("DELETE /api/tasks", () => {
    it("It should DELETE an existing task", (done) => {
      const taskId = 1;
      chai
        .request(server)
        .delete("/api/tasks/" + taskId)
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it("It should NOT DELETE a task (wrong id)", (done) => {
      const taskId = 1234;
      chai
        .request(server)
        .delete("/api/tasks/" + taskId)
        .end((err, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            "The task with the provided ID does not exist."
          );
          done();
        });
    });
  });
});

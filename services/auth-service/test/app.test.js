const { test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../index");

test("GET /health returns auth service health information", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "UP");
  assert.equal(response.body.service, "auth-service");
  assert.equal(response.body.version, "1.0.0");

  assert.equal(typeof response.body.uptime, "number");
  assert.equal(typeof response.body.timestamp, "string");
});

test("POST /auth/register rejects invalid registration data", async () => {
  const response = await request(app).post("/auth/register").send({
    name: "R",
    email: "invalid-email",
    password: "123",
  });

  assert.equal(response.status, 400);
  assert.ok(response.body.error);
});

test("POST /auth/login rejects invalid login data", async () => {
  const response = await request(app).post("/auth/login").send({
    email: "invalid-email",
    password: "123",
  });

  assert.equal(response.status, 400);
  assert.ok(response.body.error);
});

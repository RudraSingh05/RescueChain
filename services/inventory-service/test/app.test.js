const { test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../index");
const { calculateDistance } = require("../src/utils/distance");

test("GET /health returns inventory service health information", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "UP");
  assert.equal(response.body.service, "inventory-service");
  assert.equal(response.body.version, "1.0.0");

  assert.equal(typeof response.body.uptime, "number");
  assert.equal(typeof response.body.timestamp, "string");
});

test("calculateDistance returns 0 for identical coordinates", () => {
  const distance = calculateDistance(26.4499, 80.3319, 26.4499, 80.3319);

  assert.equal(distance, 0);
});

test("calculateDistance returns a positive distance between different coordinates", () => {
  const distance = calculateDistance(26.4499, 80.3319, 28.6139, 77.209);

  assert.ok(distance > 0);
});

test("calculateDistance produces the same result in both directions", () => {
  const firstDirection = calculateDistance(26.4499, 80.3319, 28.6139, 77.209);

  const reverseDirection = calculateDistance(28.6139, 77.209, 26.4499, 80.3319);

  assert.ok(Math.abs(firstDirection - reverseDirection) < 0.000001);
});

const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../utils/jwt");

const prisma = new PrismaClient();

async function register({ name, email, password }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  return generateToken(user);
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return generateToken(user);
}

module.exports = { register, login };
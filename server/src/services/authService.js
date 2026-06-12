/**
 * =============================================================================
 * services/authService.js — Registration and login business logic
 * =============================================================================
 * WHAT THIS FILE DOES:
 *   Validates credentials, hashes passwords, talks to Prisma, and issues JWTs.
 *   Controllers only pass `req.body` fields and send JSON — no bcrypt or ORM here.
 *
 * AUTHENTICATION FLOW
 * -------------------
 * 1. Register: validate input → hash password → save user (no token yet).
 * 2. Login: find user by email → compare password → sign JWT if valid.
 * 3. Protected routes: client sends `Authorization: Bearer <token>`; middleware
 *    verifies the JWT and attaches `userId` / `role` to `req.user`.
 *
 * WHY PASSWORDS ARE NEVER STORED IN PLAIN TEXT
 * --------------------------------------------
 * A database leak would expose every account if passwords were saved as typed.
 * bcrypt applies a one-way hash with a salt so we can verify logins with
 * `bcrypt.compare()` but cannot recover the original password from the stored value.
 *
 * LAYER: Service (domain/application logic; no req/res).
 * =============================================================================
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

/** Basic email shape check — not exhaustive, but catches obvious typos. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * JWT signing secret — set `JWT_SECRET` in `.env` (never commit the real value).
 * Use a long random string in production; rotate if compromised.
 */
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret?.trim()) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }
  return secret;
}

/**
 * @param {string} email
 */
function assertValidEmail(email) {
  if (!EMAIL_PATTERN.test(email)) {
    throw new AppError("Invalid email address", 400);
  }
}

/**
 * Register a new user.
 *
 * PASSWORD HASHING
 * ----------------
 * `bcrypt.hash(password, 10)` runs the password through bcrypt with cost factor
 * 10 (2^10 rounds). Only the hash is persisted — the plain password is discarded.
 *
 * @param {{ name: string, email: string, password: string }} input
 */
export async function registerUser({ name, email, password }) {
  if (!name?.trim() || !email?.trim() || !password) {
    throw new AppError("name, email, and password are required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  assertValidEmail(normalizedEmail);

  if (password.length < 6) {
    throw new AppError("Invalid password", 400);
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    },
  });
}

/**
 * Authenticate a user and return a signed JWT plus a safe user profile.
 *
 * JWT GENERATION
 * --------------
 * `jwt.sign(payload, secret, { expiresIn: '7d' })` creates a signed token the
 * client stores (e.g. localStorage). The payload carries `userId`, `email`, and
 * `role` for authorization without hitting the database on every request.
 *
 * @param {{ email: string, password: string }} input
 * @returns {Promise<{ token: string, user: { id: number, name: string, email: string, role: string } }>}
 */
export async function loginUser({ email, password }) {
  if (!email?.trim() || !password) {
    throw new AppError("email and password are required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  assertValidEmail(normalizedEmail);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

/**
 * Load the authenticated user's profile (no password hash).
 *
 * @param {string | number} userId — from `req.user.userId` after JWT verification
 * @returns {Promise<{ id: number, name: string, email: string, role: string }>}
 */
export async function getUserById(userId) {
  const id = Number.parseInt(String(userId), 10);

  if (Number.isNaN(id) || id < 1) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

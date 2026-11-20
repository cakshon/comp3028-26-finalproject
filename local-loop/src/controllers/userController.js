import sql from "../models/db.js";
import { readEmail, readID, readName, rejectUnknownFields } from "../middlewares/validation.js";

const userFields = sql`userid AS "userID", fullname AS "fullName", email, isadmin AS "isAdmin", createdat AS "createdAt"`;

function requireUser(user) {
  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }
  return user;
}

export async function postUser(req, res) {
  const userID = readID(req.body.userID, "userID");
  const fullName = readName(req.body.fullName, "fullName");
  const email = readEmail(req.body.email);
  const [user] = await sql`
    INSERT INTO Users (userid, fullname, email)
    VALUES (${userID}, ${fullName}, ${email})
    RETURNING ${userFields}
  `;
  return res.status(201).json(user);
}

export async function getUsers(req, res) {
  const users = await sql`
    SELECT ${userFields}
    FROM Users
    ORDER BY userid
  `;
  return res.json(users);
}

export async function getUser(req, res) {
  const userID = readID(req.params.userID, "userID");
  const [user] = await sql`
    SELECT ${userFields}
    FROM Users
    WHERE userid = ${userID}
  `;
  return res.json(requireUser(user));
}

export async function patchUser(req, res) {
  rejectUnknownFields(req.body, ["fullName", "email"], "Only fullName and email can be updated.");
  const fullName = req.body.fullName === undefined ? null : readName(req.body.fullName, "fullName");
  const email = req.body.email === undefined ? null : readEmail(req.body.email);
  const userID = readID(req.params.userID, "userID");
  const [user] = await sql`
    UPDATE Users
    SET fullname = COALESCE(${fullName}, fullname),
        email = COALESCE(${email}, email)
    WHERE userid = ${userID}
    RETURNING ${userFields}
  `;
  return res.json(requireUser(user));
}

export async function removeUser(req, res) {
  const userID = readID(req.params.userID, "userID");
  const [user] = await sql`
    DELETE FROM Users
    WHERE userid = ${userID}
    RETURNING userid
  `;
  requireUser(user);
  return res.status(204).send();
}

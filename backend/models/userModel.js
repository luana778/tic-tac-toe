const db = require("../config/db");
const bcrypt = require("bcrypt");

const createUser = async (username, password) => {
  const hash = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hash]
  );

  return result.insertId;
};

const getUserByUsername = async (username) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  return rows[0];
};

module.exports = { createUser, getUserByUsername };
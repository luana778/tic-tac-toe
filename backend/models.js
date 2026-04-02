// server/models.js
const pool = require("./db");
const bcrypt = require("bcrypt");

/**
 * Create a new user
 * @param {string} username
 * @param {string} password
 * @returns {number} user ID
 */
async function createUser(username, password) {
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hash]
  );
  return result.insertId;
}

/**
 * Get user by username
 * @param {string} username
 */
async function getUserByUsername(username) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  return rows[0] || null;
}

/**
 * Save game result in MySQL
 * @param {number} playerX 
 * @param {number} playerO 
 * @param {number|null} winner 
 */
async function saveGameResult(playerX, playerO, winner) {
  if (playerX == null || playerO == null || winner == null)
    return;
  await pool.query(
    "INSERT INTO games (player_x, player_o, winner) VALUES (?, ?, ?)",
    [playerX, playerO, winner]
  );
}

module.exports = { createUser, getUserByUsername, saveGameResult };
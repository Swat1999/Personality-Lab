import db from "../Auth-user-access/server.js";

export async function createUser(firstName, lastName, email, hashedPassword) {
  const [result] = await db.execute(
    "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
    [firstName, lastName, email, hashedPassword]
  );
  return result.insertId;
}

export async function findUserByEmail(email) {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD!,
  database: "ces",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;

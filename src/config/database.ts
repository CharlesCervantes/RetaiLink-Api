import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { Database } from "../core/database";

dotenv.config();

let dbConfig: any = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const dbHostValue = process.env.DB_HOST || "";
if (dbHostValue.startsWith("mysql://")) {
  try {
    const connectionUrl = new URL(dbHostValue);

    dbConfig.host = connectionUrl.hostname;
    dbConfig.port = connectionUrl.port ? parseInt(connectionUrl.port) : 3306;

    if (connectionUrl.username) {
      dbConfig.user = connectionUrl.username;
    } else {
      dbConfig.user = process.env.DB_USER || "root";
    }

    if (connectionUrl.password) {
      dbConfig.password = connectionUrl.password;
    } else {
      dbConfig.password = process.env.DB_PASSWORD || "";
    }

    if (connectionUrl.pathname && connectionUrl.pathname.length > 1) {
      dbConfig.database = connectionUrl.pathname.substring(1);
    } else {
      dbConfig.database = process.env.DB_NAME || "railway";
    }
  } catch (error) {
    dbConfig = {
      host: "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "railway",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };
  }
} else {
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "railway",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

console.log("Configuración de conexión a la base de datos:", {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port || 3306,
});

const pool = mysql.createPool(dbConfig);
const db = new Database(pool);

export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión a la base de datos establecida correctamente");
    connection.release();
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw error;
  }
};

export default db;

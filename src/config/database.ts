// config/database.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Parsear la URL de conexión si está en formato URL completo
let dbConfig: any = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Comprobar si DB_HOST es una URL completa de MySQL
const dbHostValue = process.env.DB_HOST || '';
if (dbHostValue.startsWith('mysql://')) {
  // Es una URL completa, necesitamos parsearla
  try {
    const connectionUrl = new URL(dbHostValue);
    
    // Extraer las partes de la URL
    dbConfig.host = connectionUrl.hostname;
    dbConfig.port = connectionUrl.port ? parseInt(connectionUrl.port) : 3306;
    
    // Si hay credenciales en la URL, extraerlas
    if (connectionUrl.username) {
      dbConfig.user = connectionUrl.username;
    } else {
      dbConfig.user = process.env.DB_USER || 'root';
    }
    
    if (connectionUrl.password) {
      dbConfig.password = connectionUrl.password;
    } else {
      dbConfig.password = process.env.DB_PASSWORD || '';
    }
    
    // Extraer el nombre de la base de datos del path (quitar el slash inicial)
    if (connectionUrl.pathname && connectionUrl.pathname.length > 1) {
      dbConfig.database = connectionUrl.pathname.substring(1);
    } else {
      dbConfig.database = process.env.DB_NAME || 'railway';
    }
  } catch (error) {
    console.error('Error al parsear la URL de conexión:', error);
    // Usar configuración predeterminada si falla el parseo
    dbConfig = {
      host: 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'railway',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
  }
} else {
  // Configuración estándar con valores separados
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

console.log('Configuración de conexión a la base de datos:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port || 3306
});

// Crear el pool de conexiones con la configuración parseada
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  }
};

export default pool;
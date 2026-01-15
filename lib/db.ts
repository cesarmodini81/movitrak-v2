
import sql from 'mssql';

const sqlConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // true for azure, false for local
    trustServerCertificate: true // change to false for production
  }
};

let pool: sql.ConnectionPool | null = null;

export const getDbConnection = async () => {
  try {
    if (pool) return pool;
    pool = await new sql.ConnectionPool(sqlConfig).connect();
    return pool;
  } catch (err) {
    console.error('SQL Connection Error:', err);
    return null; // Return null to trigger mock fallback in API handlers
  }
};

export { sql };

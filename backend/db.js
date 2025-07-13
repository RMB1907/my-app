import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT),
  database: process.env.PGDATABASE,
  ssl: false,
});

export default pool;

import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const MAX_CONNECTION_RETRIES = Number(process.env.DB_CONNECT_RETRIES || 20);
const RETRY_DELAY_MS = Number(process.env.DB_CONNECT_RETRY_DELAY_MS || 3000);

const client = new Client({
  host: DB_HOST,
  port: DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

let connectionAttempts = 0;

const connectWithRetry = async () => {
  connectionAttempts += 1;

  try {
    await client.connect();
    console.log(`PostgreSQL connected to ${DB_HOST}:${DB_PORT}`);
  } catch (err) {
    console.error(
      `PostgreSQL connection failed (${connectionAttempts}/${MAX_CONNECTION_RETRIES}): ${err.message}`
    );

    if (DB_HOST === 'db') {
      console.log('If backend is running outside Docker, set DB_HOST=localhost or the actual database host.');
    }

    if (connectionAttempts >= MAX_CONNECTION_RETRIES) {
      console.error('PostgreSQL connection retries exhausted.');
      return;
    }

    setTimeout(connectWithRetry, RETRY_DELAY_MS);
  }
};

connectWithRetry();

export default client;

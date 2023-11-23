import pkg from 'pg';
import "dotenv/config";

const { Client } = pkg;

export const database = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  timezone: 'America/Sao_Paulo',
});

export const startDatabase = async () => {
  await database.connect();
};

export const closeDatabase = async () => {
  await database.end();
};

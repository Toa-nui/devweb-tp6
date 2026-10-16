import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 8080;
export const DB_FILE = process.env.DB_FILE || 'database/database.sqlite';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
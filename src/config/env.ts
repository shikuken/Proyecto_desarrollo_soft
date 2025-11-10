import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || '4000',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_in_production',
  DB_PATH: process.env.DB_PATH || './database.sqlite'
};

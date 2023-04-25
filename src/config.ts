import process from 'node:process';
import dotenv from 'dotenv';

export interface EnvironmentConfig {
  BOT_TOKEN: string;
  CHAT_ID: string;
  CHANNEL_ID: string;
  CHANNEL_URL: string;
  PORT: string;
}

dotenv.config();

export const environmentConfig = process.env as unknown as EnvironmentConfig;

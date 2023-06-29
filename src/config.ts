import process from 'node:process';
import dotenv from 'dotenv';

export interface BotEnvironmentConfig {
  BOT_TOKEN: string;
  CHAT_ID: string;
  CHANNEL_ID: string;
  CHANNEL_URL: string;
  PORT: string;
  BOT_TYPE?: 'long-polling' | 'webhooks' | '';
  NODE_ENV?: 'local' | 'production';
}

export interface RenderEnvironmentConfig {
  RENDER: boolean;
  RENDER_EXTERNAL_URL: string;
}

export type EnvironmentConfig = BotEnvironmentConfig & Partial<RenderEnvironmentConfig>;

dotenv.config();

export const environmentConfig = process.env as unknown as EnvironmentConfig;

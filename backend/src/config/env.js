import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  port: Number(process.env.PORT) || 3001,
};

if (!env.openaiApiKey) {
  console.warn('Warning: OPENAI_API_KEY is not set. Add it to your .env file.');
}

import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development.local"}` });
export const { PORT, NODE_ENV, DB_URI, MJ_SECRET_KEY, MJ_API_KEY, JWT_SECRET, MJ_EMAIL_ADD } = process.env;

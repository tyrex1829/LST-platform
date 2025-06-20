import env from "dotenv";
env.config();

export const PORT = process.env.PORT || 3000;
export const PUBLIC_KEY = process.env.PUBLIC_KEY;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const TOKEN_MINT_ADDRESS = process.env.TOKEN_MINT_ADDRESS;
export const RPC_URL = process.env.RPC_URL;

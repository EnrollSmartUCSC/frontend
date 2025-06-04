import dotenv from "dotenv";
import path from "path";

// Load the .env file located at the project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

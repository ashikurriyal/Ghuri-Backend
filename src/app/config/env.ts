import dotenv = require("dotenv");

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  BCRYPT_SALT_AROUND: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
}

const loadEnvVariables = (): EnvConfig => {

  const requiredEnvVariables : string[] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_AROUND", "JWT_ACCESS_EXPIRES", "JWT_ACCESS_SECRET"];
  requiredEnvVariables.forEach(key => {
    if(!process.env[key]){
      throw new Error(`Missing require environment variable ${key}`)
    }
  })
  return {
    PORT: process.env.PORT as string,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_AROUND: process.env.BCRYPT_SALT_AROUND as string,
    JWT_ACCESS_EXPIRES:process.env.JWT_ACCESS_EXPIRES as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  };
};
const envVars = loadEnvVariables()

export = envVars;

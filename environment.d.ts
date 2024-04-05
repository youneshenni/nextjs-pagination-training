/* eslint-disable no-unused-vars */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;

      LOGS_DIRECTORY: string;

      SERVER_URL: string;
      CLIENT_URL: string;
      CLIENT_ID: string;

      SALT_ROUNDS: string;

      SIZE: string;

      JWT_PASSPHRASE: string;
      
    }
  }
}

interface auth {
  user?: string;
  admin?: boolean;
  role?: "Client" | "Employee" | undefined;
}

declare module "express" {
  interface Request {
    auth;
  }
  // declare type IronSession = IronSessionData;
}

declare module "http" {
  interface IncomingMessage {
    auth;
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

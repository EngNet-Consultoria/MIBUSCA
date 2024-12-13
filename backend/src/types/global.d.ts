declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
  }
}

declare namespace Express {
  interface Request {
    userId?: number;
  }
}

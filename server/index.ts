/* eslint-disable import/first */
import express, { Express } from "express";
import * as http from "http";
import nextJS, { NextApiHandler } from "next";
import morgan from "morgan";
import { createWriteStream, mkdirSync } from "fs";
import { join } from "path";
import { env } from "process";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") config();

import api from "./api";

const { LOGS_DIRECTORY } = env;
const port: number = parseInt(process.env.PORT || "3000", 10);
const dev: boolean = process.env.NODE_ENV !== "production";
const nextApp = nextJS({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

export default nextApp.prepare().then(async () => {
  const app: Express = express();
  const server: http.Server = http.createServer(app);
  // eslint-disable-next-line no-new
  morgan.token("body", (req) =>
    JSON.stringify((req as unknown as { body: Object }).body)
  );
  morgan.token("resMessage", (_req, res) => res.statusMessage);
  try {
    mkdirSync(join(__dirname, "..", LOGS_DIRECTORY));
  } catch (e: any) {
    if (e.code === "EEXIST") {
      // ignore
    } else {
      process.exit(e);
    }
  }
  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status ":resMessage" Response time: :response-time ms - Response length: :res[content-length] ":body" - Request length: :req[content-length] ":referrer" ":user-agent"',
      {
        stream: createWriteStream(
          join(__dirname, "..", LOGS_DIRECTORY, "http.log"),
          {}
        ),
      }
    )
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api/", api);
  app.all("*", (req: any, res: any) => nextHandler(req, res));
  server.listen(port);

  return app;
});

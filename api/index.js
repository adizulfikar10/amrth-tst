import jsonServer from "json-server";
import path from "path";
import fs from "fs";

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// In Vercel, process.cwd() is the root of the project
const db1Path = path.join(process.cwd(), "server", "db-step1.json");
const db2Path = path.join(process.cwd(), "server", "db-step2.json");

const db1 = JSON.parse(fs.readFileSync(db1Path, "utf-8"));
const db2 = JSON.parse(fs.readFileSync(db2Path, "utf-8"));
const db = { ...db1, ...db2 };

const router = jsonServer.router(db);

server.use(middlewares);

// Rewriter to handle requests coming to /api/...
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);

server.use(router);

export default server;

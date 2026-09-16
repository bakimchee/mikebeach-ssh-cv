import { createHttpServer } from "./http-server";
import { createSshServer } from "./ssh-server";

// One visitor's malformed input shouldn't take the whole server down for everyone else.
process.on("uncaughtException", (e) => console.error("uncaughtException", e));
process.on("unhandledRejection", (e) => console.error("unhandledRejection", e));

const port = Number(process.env.PORT ?? 2222);
const httpPort = Number(process.env.HTTP_PORT ?? 8080);

const server = createSshServer();
server.listen(port, "0.0.0.0", () => {
  console.log(`SSH portfolio listening on :${port}`);
});

const httpServer = createHttpServer();
httpServer.listen(httpPort, "0.0.0.0", () => {
  console.log(`HTTP portfolio listening on :${httpPort}`);
});

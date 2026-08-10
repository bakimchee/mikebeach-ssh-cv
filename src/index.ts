import { createSshServer } from "./ssh-server";

// One visitor's malformed input shouldn't take the whole server down for everyone else.
process.on("uncaughtException", (e) => console.error("uncaughtException", e));
process.on("unhandledRejection", (e) => console.error("unhandledRejection", e));

const port = Number(process.env.PORT ?? 2222);

const server = createSshServer();
server.listen(port, "0.0.0.0", () => {
  console.log(`SSH portfolio listening on :${port}`);
});

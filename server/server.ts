import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";
import { setupSocketsHandlers } from "../sockets/socket.ts";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
var socketServer: Server;

app.prepare().then(() => {
	const httpServer = createServer(handler);

	socketServer = new Server(httpServer);
	setupSocketsHandlers(socketServer);
	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});

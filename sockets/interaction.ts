import { Server, Socket } from "socket.io";

export function setupInteractionHandlers(io: Server, socket: Socket) {
	socket.on("stopInteraction", () => {
		io.sockets.emit("stopInteraction");
	});
}

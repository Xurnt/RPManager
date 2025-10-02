import { Server, Socket } from "socket.io";

export function setupInteractionHandlers(io: Server) {
	io.on("connection", (socket: Socket) => {
		console.log("New /dice connection:", socket.id);

		socket.on("stopInteraction", () => {
			io.sockets.emit("stopInteraction");
		});

		socket.on("disconnect", () => {
			console.log("Dice socket disconnected:", socket.id);
		});
	});
}

import { Server, Socket } from "socket.io";
import { prisma } from "../server/prisma";

export function setupCharactersHandlers(io: Server) {
	io.on("connection", (socket: Socket) => {
		console.log("New /dice connection:", socket.id);

		socket.on("getCharactersServer", async () => {
			const characters = await prisma.character.findMany();
			io.sockets.emit("getCharactersClient", characters);
		});

		socket.on("disconnect", () => {
			console.log("Dice socket disconnected:", socket.id);
		});
	});
}

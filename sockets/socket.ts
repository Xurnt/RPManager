import { Server, Socket } from "socket.io";
import { setupInteractionHandlers } from "./interaction";
import { setupDiceHandlers } from "./dice";
import { setupStatsHandlers } from "./stats";
import { setupUsersHandlers } from "./users";
import { setupCharactersHandlers } from "./character";

export function setupSocketsHandlers(io: Server) {
	io.on("connection", (socket: Socket) => {
		console.log("New connection:", socket.id);
		setupInteractionHandlers(io, socket);
		setupDiceHandlers(io, socket);
		setupStatsHandlers(io, socket);
		setupUsersHandlers(io, socket);
		setupCharactersHandlers(io, socket);
		socket.on("disconnect", () => {
			console.log("Dice socket disconnected:", socket.id);
		});
	});
}

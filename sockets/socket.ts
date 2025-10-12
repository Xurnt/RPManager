import { Server, Socket } from "socket.io";
import { setupInteractionHandlers } from "./interaction";
import { setupDiceHandlers } from "./dice";
import { setupStatsHandlers } from "./stats";
import { setupUsersHandlers } from "./users";
import { setupTextHandlers } from "./text";
import { setupCharactersHandlers } from "./character";
import { setupGameSessionHandlers } from "./gameSession";

export function setupSocketsHandlers(io: Server) {
	io.on("connection", (socket: Socket) => {
		console.log("New connection:", socket.id);
		setupInteractionHandlers(io, socket);
		setupDiceHandlers(io, socket);
		setupStatsHandlers(io, socket);
		setupUsersHandlers(io, socket);
		setupCharactersHandlers(io, socket);
		setupTextHandlers(io, socket);
		setupGameSessionHandlers(io, socket);
		socket.on("disconnect", () => {
			console.log("Dice socket disconnected:", socket.id);
		});
	});
}

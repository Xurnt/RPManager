import { Server, Socket } from "socket.io";
import { prisma } from "../server/prisma";

interface UpdateGameSessionType {
	sessionId: number;
	sessionStatus: boolean;
}

interface UpdateCharacterSelectabilityType {
	sessionId: number;
	characterSelectable: boolean;
}

interface GetGameSessionType {
	sessionId: number;
}

export function setupGameSessionHandlers(io: Server, socket: Socket) {
	socket.on("updateGameSessionServer", async (data: UpdateGameSessionType) => {
		await prisma.gameSession.update({
			where: {
				id: data.sessionId,
			},
			data: {
				isActive: data.sessionStatus,
			},
		});
		socket.emit("updateGameSessionClient");
	});

	socket.on(
		"updateCharacterSelectabilityServer",
		async (data: UpdateCharacterSelectabilityType) => {
			await prisma.gameSession.update({
				where: {
					id: data.sessionId,
				},
				data: {
					isCharacterSelectionAllowed: data.characterSelectable,
				},
			});
			socket.emit("updateGameSessionClient");
		}
	);

	socket.on("getGameSessionServer", async (data: GetGameSessionType) => {
		const gameSession = await prisma.gameSession.findUnique({
			where: {
				id: data.sessionId,
			},
		});
		io.emit("getGameSessionClient", gameSession);
	});
}

import { Server, Socket } from "socket.io";
import { prisma } from "../server/prisma";

interface SelectCharacterRequest {
	userId: number;
	characterId: number;
	secondaryClassId: number;
}

export function setupUsersHandlers(io: Server) {
	io.on("connection", (socket: Socket) => {
		console.log("New /dice connection:", socket.id);

		socket.on("getUsersServer", async () => {
			const users = await prisma.user.findMany({
				relationLoadStrategy: "join",
				include: {
					UserRole: true,
				},
			});
			io.sockets.emit("getUsersClient", users);
		});

		socket.on("selectCharacterServer", async (data: SelectCharacterRequest) => {
			await prisma.user.update({
				where: {
					id: data.userId,
				},
				data: {
					characterId: data.characterId,
				},
			});
			await prisma.character.update({
				where: {
					id: data.characterId,
				},
				data: {
					selectable: false,
					secondClassId: data.secondaryClassId,
				},
			});
			io.sockets.emit("selectCharacterClient");
		});

		socket.on("disconnect", () => {
			console.log("Dice socket disconnected:", socket.id);
		});
	});
}

import { Server, Socket } from "socket.io";
import { prisma } from "../server/prisma";
import { User } from "@prisma/client";

interface SelectCharacterRequest {
	userId: number;
	characterId: number;
	secondaryClassId: number;
}

interface DefaultPlayerInteractiontRequest {
	targets: number[];
}

export function setupUsersHandlers(io: Server, socket: Socket) {
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

	socket.on(
		"forceDisconnectServer",
		async (data: DefaultPlayerInteractiontRequest) => {
			for (let characterId of data.targets) {
				const target: User | null = await prisma.user.findFirst({
					where: {
						characterId: characterId,
					},
				});
				if (target) {
					await prisma.user.update({
						where: {
							id: target.id,
						},
						data: {
							isConnected: false,
						},
					});
				}
			}
			io.emit("forceDisconnectClient");
		}
	);

	socket.on(
		"removeCharacterServer",
		async (data: DefaultPlayerInteractiontRequest) => {
			for (let characterId of data.targets) {
				const target: User | null = await prisma.user.findFirst({
					where: {
						characterId: characterId,
					},
				});
				if (target) {
					await prisma.user.update({
						where: {
							id: target.id,
						},
						data: {
							characterId: null,
						},
					});
					if (target.characterId) {
						await prisma.character.update({
							where: {
								id: target.characterId,
							},
							data: {
								selectable: true,
								secondClassId: null,
							},
						});
					}
				}
			}
			io.emit("removeCharacterClient");
		}
	);
}

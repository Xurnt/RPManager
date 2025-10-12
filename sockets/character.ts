import { Server, Socket } from "socket.io";
import { prisma } from "../server/prisma";

export function setupCharactersHandlers(io: Server, socket: Socket) {
	socket.on("getCharactersServer", async () => {
		const characters = await prisma.character.findMany();
		io.emit("getCharactersClient", characters);
	});

	socket.on("setCharacterSelectabilityServer", async (value: boolean) => {
		const characters = await prisma.character.findMany();
		const users = await prisma.user.findMany();
		const selectedCharaters = users
			.map((user) => user.characterId)
			.filter((characterId) => characterId != null);
		const nonSelectedCharacters = characters.filter(
			(character) => !selectedCharaters.includes(character.id)
		);
		for (let character of nonSelectedCharacters) {
			await prisma.character.update({
				where: {
					id: character.id,
				},
				data: {
					selectable: value,
				},
			});
		}
		io.sockets.emit("setCharacterSelectabilityClient");
	});
}

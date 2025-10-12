import { Server, Socket } from "socket.io";
import { prisma } from "../server/prisma";

interface UpdateTextServerData {
	title: string;
	core: string;
}

export function setupTextHandlers(io: Server, socket: Socket) {
	socket.on("getTextServer", async (data: UpdateTextServerData) => {
		const text = await prisma.textDisplay.findUnique({
			where: {
				id: 1,
			},
		});
		io.sockets.emit("getTextClient", text);
	});

	socket.on("updateTextServer", async (data: UpdateTextServerData) => {
		await prisma.textDisplay.update({
			where: {
				id: 1,
			},
			data: {
				title: data.title,
				core: data.core,
			},
		});
		io.sockets.emit("updateTextClient");
	});
}

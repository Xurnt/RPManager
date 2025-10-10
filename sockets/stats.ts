"use server";

import { CurrentStatName, StatName, UpdateType } from "../data/stats";
import { prisma } from "../server/prisma";
import { Server, Socket } from "socket.io";

interface StatBodyUpdateRequest {
	value: number;
	targets: number[];
	currentStat: CurrentStatName;
	type: UpdateType;
	stat: StatName;
}
export function setupStatsHandlers(io: Server, socket: Socket) {
	socket.on("updateStatsServer", async (data: StatBodyUpdateRequest) => {
		const { value, targets, stat, type, currentStat } = data;
		console.log(data);
		for (let targetId of targets) {
			const targetCharacter = await prisma.character.findUnique({
				where: {
					id: targetId,
				},
			});
			if (targetCharacter) {
				var updatedData: Partial<Record<CurrentStatName, number>> = {};
				if (type == UpdateType.ADD) {
					if (
						stat != StatName.DESTINY &&
						targetCharacter[currentStat] + value > targetCharacter[stat]
					) {
						updatedData[currentStat] = targetCharacter[stat];
					} else {
						updatedData[currentStat] = targetCharacter[currentStat] + value;
					}
				} else if (type == UpdateType.REMOVE) {
					if (targetCharacter[currentStat] - value < 0) {
						updatedData[currentStat] = 0;
					} else {
						updatedData[currentStat] = targetCharacter[currentStat] - value;
					}
				}

				await prisma.character.update({
					where: {
						id: targetCharacter.id,
					},
					data: updatedData,
				});
				socket.emit("updateStatsClient");
			}
		}
	});
}

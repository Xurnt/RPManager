import { prisma } from "../server/prisma";
import { BonusMalus, BonusMalusOperation, StatName } from "../data/roll.ts";
import { Server, Socket } from "socket.io";
import { DiceState } from "@/components/adventure/game-manager/dice.tsx";

interface DiceRollRequest {
	bonusMalusList: BonusMalus[];
	stat: StatName;
	successScore: number;
	targets: number[];
}

export interface DiceRollData {
	successScore: number;
	bonusMalusValue: number;
	target: number;
	statDiceValue?: number;
	statName?: StatName;
	diceIds: number[];
}

export interface UpdateDiceStateRequest {
	id: number;
	value?: number;
	state: DiceState;
}
var diceId = 0;

export function setupDiceHandlers(io: Server) {
	io.on("connection", (socket: Socket) => {
		console.log("New /dice connection:", socket.id);

		socket.on("stat", async (rollRequest: DiceRollRequest) => {
			console.log("NEW DICE MESSAGE");
			console.log(rollRequest);
			const { bonusMalusList, stat, successScore, targets } = rollRequest;
			var responseData: DiceRollData[] = [];
			for (let targetId of targets) {
				const targetCharacter = await prisma.character.findUnique({
					where: {
						id: targetId,
					},
				});
				if (targetCharacter) {
					let bonusMalusValue: number = 0;
					for (let bonusMalusItem of bonusMalusList) {
						switch (bonusMalusItem.operation) {
							case BonusMalusOperation.BONUS:
								bonusMalusValue += bonusMalusItem.value;
								break;
							case BonusMalusOperation.MALUS:
								bonusMalusValue -= bonusMalusItem.value;
								break;
							default:
								break;
						}
					}
					var diceIds = [];
					for (let i = 0; i < 2; i++) {
						diceIds.push(diceId);
						diceId++;
					}
					responseData.push({
						statDiceValue: targetCharacter[stat],
						target: targetId,
						bonusMalusValue: bonusMalusValue,
						successScore: successScore,
						statName: stat,
						diceIds: diceIds,
					});
				}
				io.sockets.emit("statDicePlayerView", responseData);
			}
		});

		socket.on(
			"updateDiceStateServer",
			(updateStateRequest: UpdateDiceStateRequest) => {
				io.sockets.emit("updateDiceStateClient", updateStateRequest);
			}
		);

		socket.on("disconnect", () => {
			console.log("Dice socket disconnected:", socket.id);
		});
	});
}

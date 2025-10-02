import { prisma } from "../server/prisma";
import {
	BonusMalus,
	BonusMalusOperation,
	RollType,
	StatName,
} from "../data/roll.ts";
import { Server, Socket } from "socket.io";
import { DiceState } from "@/components/adventure/game-manager/dice.tsx";

export interface DiceRollRequest {
	bonusMalusList: BonusMalus[];
	stat?: StatName;
	successScore: number;
	targets: number[];
	type: RollType;
}

export interface DiceRollData {
	id: number;
	successScore: number;
	bonusMalusValue: number;
	target: number;
	statDiceValue?: number;
	statName?: StatName;
	maxManaUsage?: number;
	diceIds: number[];
	type: RollType;
}

export interface UpdateDiceStateRequest {
	id: number;
	value?: number;
	state: DiceState;
}

export interface SetManaUsageRequest {
	id: number;
	characterId: number;
	mana: string;
}

var diceId = 0;
var diceRollId = 0;

export function setupDiceHandlers(io: Server) {
	io.on("connection", (socket: Socket) => {
		console.log("New /dice connection:", socket.id);

		socket.on("createRoll", async (rollRequest: DiceRollRequest) => {
			console.log(rollRequest);
			const { bonusMalusList, stat, successScore, targets, type } = rollRequest;
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
					var diceNumber = 1;
					if (type == RollType.Stat) {
						diceNumber++;
					}
					if (bonusMalusList.length > 0) {
						diceNumber++;
					}
					for (let i = 0; i < diceNumber; i++) {
						diceIds.push(diceId);
						diceId++;
					}

					var responseDataBody: DiceRollData = {
						target: targetId,
						bonusMalusValue: bonusMalusValue,
						successScore: successScore,
						statName: stat,
						diceIds: diceIds,
						type: type,
						id: diceRollId,
					};
					if (stat) {
						responseDataBody.statDiceValue = targetCharacter[stat];
					}
					if (type == RollType.Magic) {
						responseDataBody.maxManaUsage = targetCharacter.currentMana;
					}
					responseData.push(responseDataBody);
					diceRollId++;
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

		socket.on(
			"setManaUsageServer",
			async (updateStateRequest: SetManaUsageRequest) => {
				const targetCharacter = await prisma.character.findUnique({
					where: {
						id: updateStateRequest.characterId,
					},
				});
				if (targetCharacter) {
					const currentManaPreviousValue = targetCharacter.currentMana;
					await prisma.character.update({
						where: {
							id: targetCharacter.id,
						},
						data: {
							currentMana:
								currentManaPreviousValue - parseInt(updateStateRequest.mana),
						},
					});
					io.sockets.emit("setManaUsageClient", updateStateRequest);
				}
			}
		);

		socket.on("disconnect", () => {
			console.log("Dice socket disconnected:", socket.id);
		});
	});
}

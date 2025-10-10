import { prisma } from "../server/prisma";
import {
	BonusMalus,
	BonusMalusOperation,
	DiceState,
	RollStatName,
	RollType,
} from "../data/roll.ts";
import { Server, Socket } from "socket.io";
import { getRandomIntInclusive } from "../utils/math";

export interface DiceRollRequest {
	bonusMalusList: BonusMalus[];
	stat?: RollStatName;
	successScore: number;
	targets: number[];
	type: RollType;
	normalDice: number;
}

export interface DiceRollData {
	id: number;
	successScore: number;
	bonusMalusValue: number;
	target: number;
	statDiceValue?: number;
	statName?: RollStatName;
	maxManaUsage?: number;
	diceIds: number[];
	type: RollType;
	normalDice: number;
	destiny: number;
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

export function setupDiceHandlers(io: Server, socket: Socket) {
	socket.on("createRollServer", async (rollRequest: DiceRollRequest) => {
		console.log(rollRequest);
		const { bonusMalusList, stat, successScore, targets, type, normalDice } =
			rollRequest;
		var responseData: DiceRollData[] = [];
		for (let targetId of targets) {
			const targetCharacter = await prisma.character.findUnique({
				where: {
					id: targetId,
				},
			});
			if (targetCharacter) {
				let bonusMalusValue: number = 0;
				bonusMalusValue -= getRandomIntInclusive(
					0,
					targetCharacter.currentCorruption
				);

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
					normalDice: normalDice,
					destiny: targetCharacter.destiny,
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
			io.sockets.emit("createRollClient", responseData);
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
}

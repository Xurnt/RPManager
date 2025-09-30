"use server";

import {
	CurrentStatName,
	StatName,
	UpdateType,
} from "@/components/adventure/game-manager/dm-views/update-stat-view";
import { prisma } from "@/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";

interface StatBodyUpdateRequest extends NextApiRequest {
	body: {
		value: number;
		targets: number[];
		currentStat: CurrentStatName;
		type: UpdateType;
		stat: StatName;
	};
}

export default async function handler(
	req: StatBodyUpdateRequest,
	res: NextApiResponse
) {
	try {
		const { value, targets, stat, type, currentStat } = req.body;
		for (let targetId of targets) {
			const targetCharacter = await prisma.character.findUnique({
				where: {
					id: targetId,
				},
			});
			if (targetCharacter) {
				var updatedData: Partial<Record<CurrentStatName, number>> = {};
				if (type == UpdateType.ADD) {
					if (targetCharacter[currentStat] + value > targetCharacter[stat]) {
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
			}
		}
		res.status(200).json({
			success: true,
		});
	} catch (error: any) {
		if (error.type === "CredentialsSignin") {
			res.status(401).json({ error: "Invalid credentials." });
		} else {
			res.status(500).json({ error: "Something went wrong." });
		}
	}
}

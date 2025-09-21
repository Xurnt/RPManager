"use server";

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { sessionId, sessionStatus } = req.body;
		await prisma.gameSession.update({
			where: {
				id: sessionId,
			},
			data: {
				isActive: sessionStatus,
			},
		});
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

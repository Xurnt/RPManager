"use server";

import { prisma } from "@/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { userId } = req.body;
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				isConnected: false,
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

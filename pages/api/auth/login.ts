"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { username, password } = req.body;
		const user = await prisma.user.findMany({
			where: {
				name: username,
				password: password,
			},
		});
		res.status(200).json({ success: true, userId: user[0].id });
	} catch (error: any) {
		if (error.type === "CredentialsSignin") {
			res.status(401).json({ error: "Invalid credentials." });
		} else {
			res.status(500).json({ error: "Something went wrong." });
		}
	}
}

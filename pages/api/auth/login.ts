"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { username, password } = req.body;
		const jwtSecretKey = process.env.JWT_SECRET;
		const user = await prisma.user.findMany({
			where: {
				name: username,
				password: password,
			},
		});

		var data = {
			userId: user[0].id,
			characterId: user[0].characterId,
		};
		if (jwtSecretKey) {
			const token = jwt.sign(data, jwtSecretKey);
			const cookie = serialize("jwt", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				maxAge: 60 * 60 * 24 * 7, // One week
				path: "/",
			});

			res.setHeader("Set-Cookie", cookie);
			res.status(200).json({
				success: true,
				token,
			});
		} else {
			throw new Error("Error in environnement");
		}
	} catch (error: any) {
		if (error.type === "CredentialsSignin") {
			res.status(401).json({ error: "Invalid credentials." });
		} else {
			res.status(500).json({ error: "Something went wrong." });
		}
	}
}

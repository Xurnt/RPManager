"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { prisma } from "../../../server/prisma";

interface SignupRequest extends NextApiRequest {
	body: {
		username: string;
		password: string;
	};
}

export default async function handler(
	req: SignupRequest,
	res: NextApiResponse
) {
	try {
		const { username, password } = req.body;
		const jwtSecretKey = process.env.JWT_SECRET;
		const user = await prisma.user.create({
			data: {
				name: username,
				password: password,
				characterId: null,
				roleId: 2,
				isConnected: true,
			},
		});

		var data = {
			userId: user.id,
			characterId: null,
		};
		if (jwtSecretKey) {
			const token = jwt.sign(data, jwtSecretKey);
			const cookie = serialize("jwt", token, {
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
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

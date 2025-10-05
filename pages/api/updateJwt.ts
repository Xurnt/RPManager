"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serialize } from "cookie";
import { prisma } from "@/server/prisma";

interface MyJwtPayload extends JwtPayload {
	userId: number;
	characterId: number;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const jwtSecretKey = process.env.JWT_SECRET;
		const jwtToken = req.cookies["jwt"];
		if (jwtSecretKey && jwtToken) {
			const verified = jwt.verify(jwtToken, jwtSecretKey) as MyJwtPayload;
			if (verified) {
				const user = await prisma.user.findUnique({
					where: {
						id: verified.userId,
					},
				});
				if (user) {
					var data = {
						userId: user.id,
						characterId: user.characterId,
					};
					const token = jwt.sign(data, jwtSecretKey);
					const cookie = serialize("jwt", token, {
						httpOnly: false,
						secure: process.env.NODE_ENV === "production",
						path: "/",
					});
					res.setHeader("Set-Cookie", cookie);
					return res.status(200).json({
						success: true,
						token,
					});
				}
				return res.status(500).json({});
			}
			// Access Denied
			return res.status(401).json({ message: "Jwt token error" });
		} else {
			throw new Error("Internal server error");
		}
	} catch (error) {
		// Access Denied
		return res.status(401).json({ message: "random error" });
	}
}

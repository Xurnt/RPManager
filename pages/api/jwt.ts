import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const jwtSecretKey = process.env.JWT_SECRET;
	const jwtToken = req.cookies["jwt"];
	try {
		console.log("aaaa");
		if (jwtSecretKey && jwtToken) {
			console.log("bbb");
			const verified = jwt.verify(jwtToken, jwtSecretKey);
			console.log("bbbbbbbbb");
			if (verified) {
				console.log(verified);
				return res.status(200).json(verified);
			} else {
				// Access Denied
				console.log("ddd");
				return res.status(401).json({ message: "Jwt token error" });
			}
		} else {
			throw new Error("Internal server error");
		}
	} catch (error) {
		// Access Denied
		return res.status(401).json({ message: "random error" });
	}
}

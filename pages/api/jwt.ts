import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const jwtSecretKey = process.env.JWT_SECRET;
	const jwtToken = req.cookies["jwt"];
	try {
		if (jwtSecretKey && jwtToken) {
			const verified = jwt.verify(jwtToken, jwtSecretKey);
			if (verified) {
				return res.status(200).json(verified);
			} else {
				// Access Denied
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

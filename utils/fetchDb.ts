"use server";
import { Character, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function fetchCharacter(): Promise<Character[]> {
	return prisma.character.findMany();
}

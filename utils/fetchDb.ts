"use server";
import { Character } from "@prisma/client";
import { prisma } from "../server/prisma";

export default async function fetchCharacter(): Promise<Character[]> {
	return prisma.character.findMany();
}

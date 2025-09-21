"use server"
import ClientProviders from "@/components/client-providers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {

	const characters= await prisma.character.findMany();
	const classCategories= await prisma.classCategory.findMany();
	const classes= await prisma.class.findMany();
	const users= await prisma.user.findMany({
		relationLoadStrategy: "join",
		include: {
			UserRole: true,
		},
	});
	const gameSession = await prisma.gameSession.findFirst()
	console.log(characters)
  return (
		<ClientProviders gameSession={gameSession} users={users} characters={characters} classCategories={classCategories} classes={classes} />
  );
}

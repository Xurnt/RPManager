"use server"
import ClientProviders from "@/components/client-providers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {

	const characters= await prisma.character.findMany();
	const classCategories= await prisma.classCategory.findMany();
	const classes= await prisma.class.findMany();
	
  return (
		<ClientProviders characters={characters} classCategories={classCategories} classes={classes} />
  );
}

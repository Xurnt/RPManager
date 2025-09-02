"use server"
import { ClientLayout } from "@/components/client-layout";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {

	const characters= await prisma.character.findMany();
	const classCategories= await prisma.classCategory.findMany();
	const classes= await prisma.class.findMany();

  return (
		<ClientLayout characters={characters} classCategories={classCategories} classes={classes} />
  );
}

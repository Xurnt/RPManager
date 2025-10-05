import { Character, Class, ClassCategory } from "@prisma/client";
import { UserData } from "../client-layout";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Image from "next/image";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { socket } from "@/socket";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import {ClassSelectionDialog } from "./classSelectionDialog"
import { useState } from "react";
interface CharacterProps {
	classes:Class[],
	categories:ClassCategory[]
	character:Character,
	userData:UserData | null
}


export function CharacterComponent(
	{
		character,
		classes,
		userData,
		categories
	}:CharacterProps
): React.ReactNode {

	const [dialogOpen, setDialogOpen] = useState<boolean>(false)


	return (
		<div className="h-full">
			<Dialog open={dialogOpen}>

				<div className="flex gap-4">
					<div className="flex-2 h-full">
						<div className="pb-4">
							<h1 className="scroll-m-20 text-left text-4xl font-bold tracking-tight text-balance">{character.name}</h1>
							<h2 className="scroll-m-20 text-left text-xl italic tracking-tight text-balance">{character.title}</h2>
						</div>
						{
							classes.filter(
								(classValue) => classValue.id == character.mainClassId
							).map(
								(classValue) => (
									categories.filter(
										(category) => (category.id == classValue.classCategoryId)
									).map(
										(category) => (
											<div key={"class" + classValue.id} className="flex pb-4">
												<span className="text-xl pr-3">Classe: </span>
												<Tooltip>
													<TooltipTrigger
														key={"class" + classValue.id}
														className="scroll-m-20 text-left text-xl font-bold tracking-tight text-balance"
													>
															{classValue.name.replace("Ecole", category.name)}
													</TooltipTrigger>
													<TooltipContent className="flex flex-col">
														<span>{category.name}: {category.description}</span>
														<span>{classValue.name}: {classValue.description}</span>
													</TooltipContent>
												</Tooltip>
											</div>
										)
									)
								)
							)
						}
						<div className="pb-4">
							<h3 className="text-xl pb-4">Statistiques:</h3>
							<div className="flex pl-4">
								<div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm flex gap-4">
									<div className="flex flex-col items-center">
										<span className="pb-2">Vitalité: {character.vitality}</span>
										<span className="pb-2">Mana: {character.mana}</span>
										<span className="pb-2">Force: {character.strength}</span>
										<span className="pb-2">Dextérité: {character.dexterity}</span>
										<span className="pb-2">Sang-froid: {character.courage}</span>
									</div>
									<div className="pl-4 flex flex-col items-center justify-between">
										<span className="pb-2">Charisme: {character.charisma}</span>
										<span className="pb-2">Perception: {character.perception}</span>
										<span className="pb-2">Discrétion: {character.discretion}</span>
										<span className="pb-2">Savoir: {character.knowledge}</span>
									</div>
								</div>
								<div className="flex-1" />
							</div>
						</div>
						<div>
							<h3 className="text-xl pb-4">Réputation:</h3>
							<Card className="px-6 mb-4">
								{character.publicStory.split("LINEBREAK").map((paragraph, paragraphIndex) => (
									<span
										key={"publicDescriptionParagraph" + paragraphIndex}
										className="text-justify mb-3 block">
											{paragraph}
									</span>
								))}
							</Card>
						</div>
					</div>
					<div className="flex-1 flex flex-col">
						<Card className="flex flex-col p-4">
							<Image
								src={character.picturePath +"/fullPicture.jpg"}
								alt={character.name +"Pic"}
								className=""
								width={1080}
								height={1350}
							/>
							{
								character.selectable && userData && userData.characterId == null
								?
								<DialogTrigger onClick={() => setDialogOpen(true)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3">
									Sélectionner ce personnage
								</DialogTrigger>
								:
									null
							}
						</Card>
					</div>
				</div>
				{
					userData?.characterId == character.id
					?
						<div className="flex gap-4">
							<div className="flex-2 h-full">
	<>
									<div>
										<h3 className="text-xl pb-4">Histoire:</h3>
										<Card className="px-6 mb-4">
											{character.privateStory.split("LINEBREAK").map((paragraph, paragraphIndex) => (
												<span
													key={"privateDescriptionParagraph" + paragraphIndex}
													className="text-justify mb-3 block">
														{paragraph}
												</span>
											))}
										</Card>
									</div>
									<div>
										<h3 className="text-xl pb-4">Talent: {character.talentName}</h3>
										<Card className="px-6 mb-4">
											{character.talentDescription.split("LINEBREAK").map((paragraph, paragraphIndex) => (
												<span
													key={"talentParagraph" + paragraphIndex}
													className="text-justify mb-3 block">
														{paragraph}
												</span>
											))}
										</Card>
									</div>
									<div>
										<h3 className="text-xl pb-4">Faiblesse: {character.weaknessName}</h3>
										<Card className="px-6 mb-4">
											{character.weaknessDescription.split("LINEBREAK").map((paragraph, paragraphIndex) => (
												<span
													key={"talentParagraph" + paragraphIndex}
													className="text-justify mb-3 block">
														{paragraph}
												</span>
											))}
										</Card>
									</div>
									<div className="flex  justify-between pb-4 gap-4">
										<div className="flex-1 flex flex-col">
											<h3 className="text-xl pb-4">Motivations: </h3>
											<Card
												className="text-justify mb-3 px-6 flex-1">
													{character.motivations}
											</Card>
										</div>
										<div className="flex-1 flex flex-col">
											<h3 className="text-xl pb-4">Peurs: </h3>
											<Card
												className="text-justify mb-3 px-6 flex-1">
													{character.fears}
											</Card>
										</div>
										
									</div>
									<div className="flex  justify-between gap-4">
										<div className="flex-1 flex flex-col">
											<h3 className="text-xl pb-4">Aime: </h3>
											<Card
												className="text-justify mb-3 px-6 flex-1">
													{character.like}
											</Card>
										</div>
										<div className="flex-1 flex flex-col">
											<h3 className="text-xl pb-4">N'aime pas: </h3>
											<Card
												className="text-justify mb-3 px-6 flex-1">
													{character.dislike}
											</Card>
										</div>
									</div>
								</>
							</div>
							<div className="flex-1 flex flex-col">
							</div>
						</div>
					:
					null
				}
				{
					userData
					?
						<ClassSelectionDialog
							classes={classes}
							categories={categories}
							userData={userData}
							mainClassId={character.mainClassId}
							characterId={character.id}
							setDialogOpen={setDialogOpen}
						/>
					:
					null	
				}
			</Dialog>
		</div>
	)
}
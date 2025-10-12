import { Character, Class, ClassCategory, GameSession, User } from "@prisma/client";
import { PlayerCard } from "./player-card";
import { UserData } from "../client-layout";
import { useEffect, useState } from "react";
import { GameManager } from "./game-manager/game-manager";
import io, { Socket } from "socket.io-client";
import { DiceRollData } from "@/sockets/dice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { socket } from "@/socket";

interface PlayerLayoutProps {
	users: User[]
	characters: Character[]
	userData:UserData | null
	gameSession:GameSession,
	classes:Class[],
	categories:ClassCategory[]
}

export function AdventureLayout(
	{
		users,
		characters,
		userData,
		gameSession,
		classes,
		categories
	}:PlayerLayoutProps
){

	const [interactionTargets, setInteractionTargets] = useState<Character[]>([])
	const [orderedCharacters, setOrderedCharacters] = useState<Character[]>(characters)
	const [newInteraction, setNewInteraction] = useState<boolean>(false)




	useEffect(() => {
		var tempCharacters:Character[] = characters.filter((character) => {
			var connectedUsers = users.filter((user) => user.isConnected)
			var connectedCharacters = connectedUsers.map((user) => user.characterId)
			if (connectedCharacters.includes(character.id)) {
				return true
			}
			return false
		})
		if (userData) {
			const currentCharacterIndex:number = tempCharacters.findIndex((character) => character.id == userData.characterId)
			if (currentCharacterIndex!=-1) {
				const currentCharacter = tempCharacters[currentCharacterIndex]
				const currentCharacterNewIndex = tempCharacters.length == 5 ? 2 : tempCharacters.length > 5 ? 0 : 1
				tempCharacters.splice(currentCharacterIndex, 1)
				tempCharacters.splice(currentCharacterNewIndex,0,currentCharacter)
			}
		}
		setOrderedCharacters(tempCharacters)
	}, [userData, characters, users])

	return(
		<div  className="flex flex-2 flex-col justify-around items-center gap-5">
			<div className="p-5 w-full h-3/4">
				{gameSession
					?
						<GameManager
							userData={userData}
							gameSession={gameSession} 
							setNewInteraction={setNewInteraction}
							interactionTargets={interactionTargets}
							newInteraction={newInteraction}
							setInteractionTargets={setInteractionTargets}
							characters={characters}
						/>
					:
						null
				}
			</div>
			<div className="flex items-stretch justify-around gap-4 items-stretch h-1/4 w-full px-5">
				<Carousel
					className="flex-2"
					opts={
						{
							loop:true,
							
						}
					}
				>
					<CarouselPrevious className="cursor-pointer" />
					<CarouselContent className="flex justify-between">
						{
							orderedCharacters.map((character) => {
								return (users.filter((user) => user.characterId == character.id).map((user) => (
									<CarouselItem key={"characterCarouselItem" + user.characterId} className="basis-1/5">
										<PlayerCard
											key={"playerCharacter" + character.id}
											user={user}
											character={character}
											isCurrentUser={user.id==userData?.userId}
											isUserDm={userData?.role == "dm"}
											interactionTargets={interactionTargets}
											newInteraction={newInteraction}
											setInteractionTargets={setInteractionTargets}
											classes={classes}
											categories={categories}
										/>
									</CarouselItem>
								)))
							})
						}
					</CarouselContent>
					<CarouselNext className="cursor-pointer" />
				</Carousel>
			</div>
		</div>
	)
}
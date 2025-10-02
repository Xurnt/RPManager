import { Character, GameSession, User } from "@prisma/client";
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

interface PlayerLayoutProps {
	users: User[]
	characters: Character[]
	userData:UserData | null
	gameSession:GameSession
}

let socket:Socket;

export function PlayerLayout({users, characters, userData, gameSession}:PlayerLayoutProps){

	const findCurrentUser: (users:User[], userData:UserData|null) => User|null =
	(users, userData) => userData ? users.filter((user) => user.id == userData.userId)[0] : null

	const findCurrentCharacter: (characters:Character[], userData:UserData|null) => Character|null =
	(characters, userData) => userData ? characters.filter((character) => character.id == userData.characterId)[0] : null


	const [interactionTargets, setInteractionTargets] = useState<Character[]>([])
	const [orderedCharacters, setOrderedCharacters] = useState<Character[]>(characters)
	const [newInteraction, setNewInteraction] = useState<boolean>(false)

	useEffect(() => {
		var tempCharacters:Character[] = [...characters]
		if (userData) {
			const currentCharacterIndex:number = tempCharacters.findIndex((character) => character.id == userData.characterId)
			if (currentCharacterIndex!=-1) {
				const currentCharacter = tempCharacters[currentCharacterIndex]
				tempCharacters.splice(currentCharacterIndex, 1)
				tempCharacters.splice(1,0,currentCharacter)
				// const arrayBeforeCharacter = tempCharacters.splice(0, currentCharacterIndex)
				// const arrayWithOnlyCharacter = tempCharacters.splice(0, 1)
				// const arrayAfterCharacter = tempCharacters
				// var newOrderedArray = []
				// if (arrayBeforeCharacter.length>0) {
				// 	newOrderedArray = arrayBeforeCharacter.splice(0,1)
				// 	newOrderedArray+=
				// }
				setOrderedCharacters(tempCharacters)
			}
		}
	}, [userData, characters])

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
					<CarouselContent className="flex justify-between h-full">
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
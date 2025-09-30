import { Character, GameSession, User } from "@prisma/client";
import { PlayerCard } from "./player-card";
import { UserData } from "../client-layout";
import { useEffect, useState } from "react";
import { GameManager } from "./game-manager/game-manager";
import io, { Socket } from "socket.io-client";
import { DiceRollData } from "@/sockets/dice";

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


	const [currentUser, setCurrentUser] = useState<User|null>(findCurrentUser(users, userData))
	const [currentUserCharacter, setCurrentUserCharacter] = useState<Character|null>(findCurrentCharacter(characters, userData))
	const [leftSideCharacters, setLeftSideCharacters] = useState<Character[]>([])
	const [rightSideCharacters, setRightSideCharacters] = useState<Character[]>([])
	const [interactionTargets, setInteractionTargets] = useState<Character[]>([])
	const [newInteraction, setNewInteraction] = useState<boolean>(false)

	useEffect(() => {
		setCurrentUser(findCurrentUser(users, userData))
		const connectedUsers = users.filter((user) => user.isConnected)
		const connectedPlayers = connectedUsers.filter((user) => user.characterId != null)
		const connectedCharacters = connectedPlayers.map((user) => characters.filter((character) => character.id == user.characterId)[0])
		if(userData){
			const currentUserCharacterTemp:Character|null = findCurrentCharacter(characters, userData)
			setCurrentUserCharacter(currentUserCharacterTemp)
			const tempCharacters:Character[] = [...connectedCharacters]
			if(currentUserCharacterTemp){
				const indexOfCurrentUserCharacterTemp:number = tempCharacters.findIndex((character) => character.id == currentUserCharacterTemp.id) 
				if (indexOfCurrentUserCharacterTemp!=-1){
					tempCharacters.splice(indexOfCurrentUserCharacterTemp, 1)
					var leftSideCharactersTemp:Character[]=[]
					if (tempCharacters.length % 2 == 0) {
						leftSideCharactersTemp= tempCharacters.splice(1, tempCharacters.length / 2)
					} else {
						leftSideCharactersTemp= tempCharacters.splice(1, (tempCharacters.length + 1) / 2)
					}
					setLeftSideCharacters(leftSideCharactersTemp)
					setRightSideCharacters(tempCharacters)
				}
			}
		} else {
				console.log(connectedCharacters)
				setLeftSideCharacters(connectedCharacters)
				setRightSideCharacters([])
			}
	}, [userData, characters])



	return(
		<div  className="flex flex-1 flex-col justify-around items-center gap-5">
			<div className="p-5 w-full h-2/3">
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
			<div className="flex items-end justify-around gap-4 h-1/3 w-full">
				{
					leftSideCharacters.map((character) => {
						return (users.filter((user) => user.characterId == character.id).map((user) => (
							<PlayerCard
								key={"playerCharacter" + character.id}
								user={user}
								character={character}
								isCurrentUser={false}
								isUserDm={userData?.role == "dm"}
								interactionTargets={interactionTargets}
								newInteraction={newInteraction}
								setInteractionTargets={setInteractionTargets}
							/>
						)))
					})
				}
				{ currentUser
					? currentUserCharacter
						?	<PlayerCard
							user={currentUser}
							character={currentUserCharacter}
							isCurrentUser={true}
							isUserDm={userData?.role == "dm"}
							interactionTargets={interactionTargets}
							newInteraction={newInteraction}
							setInteractionTargets={setInteractionTargets}
						/>
						:null
					:null
				}
				{
					rightSideCharacters.map((character) => {
						return (users.filter((user) => user.characterId == character.id).map((user) => (
							<PlayerCard
								key={"playerCharacter" + character.id}
								user={user} character={character}
								isCurrentUser={false}
								isUserDm={userData?.role == "dm"}
								newInteraction={newInteraction}
								interactionTargets={interactionTargets}
								setInteractionTargets={setInteractionTargets}
							/>
						)))
					})
				}
			</div>
		</div>
	)
}
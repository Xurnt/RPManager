import { Character, User } from "@prisma/client";
import { PlayerCard } from "./player-card";
import { UserData } from "../client-layout";
import { useEffect, useState } from "react";

interface PlayerLayoutProps {
	users: User[]
	characters: Character[]
	userData:UserData
}

const findCurrentUser: (users:User[], userData:UserData) => User =
(users, userData) => users.filter((user) => user.id == userData.userId)[0]

const findCurrentCharacter: (characters:Character[], userData:UserData) => Character =
(characters, userData) => characters.filter((character) => character.id == userData.characterId)[0]

export function PlayerLayout({users, characters, userData}:PlayerLayoutProps){

	const [currentUser, setCurrentUser] = useState<User>(findCurrentUser(users, userData))
	const [currentUserCharacter, setCurrentUserCharacter] = useState<Character>(findCurrentCharacter(characters, userData))

	useEffect(() => {
		setCurrentUser(findCurrentUser(users, userData))
		setCurrentUserCharacter(findCurrentCharacter(characters, userData))
	}, [userData])

	return(
		<div  className="flex flex-1 flex-col justify-end items-center">
			<div className="h-3/7 flex  align-stretch">
				{ currentUser
					? currentUserCharacter
						?	<PlayerCard user={currentUser} character={currentUserCharacter} isCurrentUser={true} />
						:null
					:null
				}
			</div>
		</div>
	)
}
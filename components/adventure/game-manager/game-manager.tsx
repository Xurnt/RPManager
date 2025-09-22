import { Character, GameSession } from "@prisma/client";
import { UserData } from "../../client-layout";
import { Card } from "../../ui/card";
import { Dispatch, SetStateAction, useState } from "react";
import { DmView } from "./dm-view";
import { PlayerView } from "./player-view";

interface GameManagerType {
	userData:UserData|null
	gameSession:GameSession,
	setNewInteraction: Dispatch<SetStateAction<boolean>>,
	interactionTargets:Character[],
	newInteraction:boolean,
	setInteractionTargets:Dispatch<SetStateAction<Character[]>>
}

export function GameManager(
	{
		userData,
		gameSession,
		setNewInteraction,
		interactionTargets,
		newInteraction,
		setInteractionTargets
	}:GameManagerType){

	return(
		<Card className="block w-full h-full p-5">
			{
				userData == null 
				?
					<>
						<h1 className="text-3xl text-center pb-5">Aller connecte toi</h1>
						<p className="">Stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp</p>
					</>
				:
					userData.role == "dm"
					?
						<DmView
							gameSession={gameSession}
							setNewInteraction={setNewInteraction}
							interactionTargets={interactionTargets}
							newInteraction={newInteraction}
							setInteractionTargets={setInteractionTargets}
						/>
					:
						<PlayerView />
			}
		</Card>
	)
}
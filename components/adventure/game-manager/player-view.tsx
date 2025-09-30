import { socket } from "@/socket";
import { DiceRollData } from "@/sockets/dice";
import { Dispatch, SetStateAction, useState } from "react";
import { RollView } from "./roll-view";
import { UserData } from "@/components/client-layout";
import { Character } from "@prisma/client";

interface PlayerViewProps {
	rollData:DiceRollData[]
	setRollData:Dispatch<SetStateAction<DiceRollData[]>>
	userData:UserData,
	interactionTargets:Character[],
	setInteractionTargets:Dispatch<SetStateAction<Character[]>>,
	characters:Character[]
}

export function PlayerView({
	rollData,
	setRollData,
	userData,
	interactionTargets,
	setInteractionTargets,
	characters

}:PlayerViewProps){

	const [diceViewVisible, setDiceViewVisible] = useState<boolean>(false)

	socket.on("statDicePlayerView", (data: DiceRollData[]) => {
		setRollData(data)
		setDiceViewVisible(true)
		setInteractionTargets(characters.filter((character) => data.map((dataItem) => dataItem.target).includes(character.id)))
	})

	return(
		<div className="flex flex-1 h-full">
			{
				diceViewVisible
				?
					<RollView
					 diceRollData={rollData}
					 userData={userData}
					 interactionTargets={interactionTargets}
					/>
				:
					null
			}
		</div>

	)
}
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
export enum PlayerViews {
	Main,
	Roll
}

export function PlayerView({
	rollData,
	setRollData,
	userData,
	interactionTargets,
	setInteractionTargets,
	characters

}:PlayerViewProps){

	const [playerView, setPlayerView] = useState<PlayerViews>(PlayerViews.Main)

	socket.on("createRollClient", (data: DiceRollData[]) => {
		setRollData(data)
		setPlayerView(PlayerViews.Roll)
		setInteractionTargets(characters.filter((character) => data.map((dataItem) => dataItem.target).includes(character.id)))
	})

	socket.on("stopInteraction", () => {
		setPlayerView(PlayerViews.Main)
	})

	return(
		<div className="flex flex-1 h-full">
			{
				playerView == PlayerViews.Roll
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
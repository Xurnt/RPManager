import { UserData } from "@/components/client-layout";
import { DiceRollData } from "@/sockets/dice";
import { useState } from "react";
import { SingleRoll } from "./single-roll";
import { Character } from "@prisma/client";

interface RollViewProps{
	diceRollData:DiceRollData[]
	userData:UserData,
	interactionTargets:Character[]
}

export function RollView({
		diceRollData,
		userData,
		interactionTargets
	}:RollViewProps){

		const [selfRollData, setSelfRollData] = useState<DiceRollData|null>(null)

		// useEffect(() => {
		// 	const tempRollData = [...diceRollData]
		// 	const selfRollDataIndex = tempRollData.findIndex((diceRollItem) => diceRollItem.target == userData.characterId)
		// 	if (selfRollDataIndex!=-1){
		// 		const tempSelfRollData = tempRollData.splice(selfRollDataIndex, 1)
		// 		setSelfRollData(tempSelfRollData[0])
		// 	}
		// 	else {
		// 		setSelfRollData(null)
		// 	}
		// },[diceRollData,userData])

	return(
	<div className="flex flex-1 flex-wrap justify-between max-h-1">
			{diceRollData.map((diceRollDataItem => (
				<div className="basis-1/2 p-2" key={"singleRollTarget" + diceRollDataItem.target}>
					<SingleRoll
						key={"SingleRoll" + diceRollDataItem.target}
						diceRollData={diceRollDataItem}
						interactionTargets={interactionTargets}
						canInteract={diceRollDataItem.target == userData.characterId}
						userData={userData}
					/>
				</div>
			)))}
	</div>

	)
}
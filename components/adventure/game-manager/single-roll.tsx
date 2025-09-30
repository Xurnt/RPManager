import { DiceRollData } from "@/sockets/dice";
import { Dice } from "./dice";
import { stats } from "@/data/roll";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Character } from "@/generated/prisma";

interface SingleRollProps{
	diceRollData:DiceRollData
	interactionTargets:Character[],
	canInteract:boolean
}

export function SingleRoll({
		diceRollData,
		interactionTargets,
		canInteract
	}:SingleRollProps){

		const [totalRollValue, setTotalRollValue] = useState<number>(0)

	return(
	<Card className="flex flex-col gap-4">
		<h1 className="text-center">Jet de {interactionTargets.filter((interactionTarget) => interactionTarget.id ==  diceRollData.target)[0].name}</h1>
		<div className="flex gap-4 align-center justify-around  px-4">
			{
				diceRollData.statName
				?
					<span className="flex flex-1 text-center justify-center items-center">Dé de {stats.filter((stat) => stat.pgName == diceRollData.statName)[0].name.toLowerCase()}</span>
				:
					null
			}
			<span className="flex flex-1 text-center justify-center items-center">Dé principal</span>
			{
				diceRollData.bonusMalusValue != 0
				?
					<span className="flex flex-1 justify-center text-center items-center">
						{
							diceRollData.bonusMalusValue > 0
							?
								"Bonus"
							:
								"Malus"
						}
					</span>
				:
					null
			}
			<span className="flex flex-1 justify-center text-center items-center">Résultat</span>
			<span className="flex flex-1 justify-center text-center items-center">Objectif</span>

		</div>
		<div className="flex gap-4 align-center justify-around px-4">
			{
				diceRollData.statDiceValue
				?
					<Dice
						totalRollValue={totalRollValue}
						setTotalRollValue={setTotalRollValue}
						maxValue={diceRollData.statDiceValue}
						canInteract={canInteract}
						diceRollData={diceRollData}
						id={diceRollData.diceIds[0]}
					/>
				:
					null
			}
			<Dice
				totalRollValue={totalRollValue}
				setTotalRollValue={setTotalRollValue}
				maxValue={100}
				canInteract={canInteract}
				diceRollData={diceRollData}
				id={diceRollData.diceIds[1]}
			/>
			<span className="flex flex-1 justify-center text-center items-center">{totalRollValue}</span>
			<span className="flex flex-1 justify-center text-center items-center">{diceRollData.successScore}</span>

		</div>
	</Card>

	)
}
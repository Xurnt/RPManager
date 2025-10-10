import { Button } from "@/components/ui/button";
import { IntegerUpdateOperation } from "@/data/operation";
import { DiceState } from "@/data/roll";
import { CurrentStatName, StatName } from "@/data/stats";
import { socket } from "@/socket";
import { DiceRollData, UpdateDiceStateRequest } from "@/sockets/dice";
import { getRandomIntInclusive } from "@/utils/math";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";

interface DiceProps{
	maxValue:number
	totalRollValue:number
	setTotalRollValue:Dispatch<SetStateAction<number>>
	canInteract:boolean
	id:number
	setActiveDiceNumber:Dispatch<SetStateAction<number>>
	activeDiceNumber:number,
	setCurrentDestiny:Dispatch<SetStateAction<number>>,
	currentDestiny:number,
	targetId:number
}

export function Dice({
		maxValue,
		totalRollValue,
		setTotalRollValue,
		canInteract,
		id,
		activeDiceNumber,
		setActiveDiceNumber,
		setCurrentDestiny,
		currentDestiny,
		targetId
	}:DiceProps){
		const [value, setValue] = useState<number>(maxValue)
		const [diceState, setDiceState] = useState<DiceState>(DiceState.TO_ROLL)
		const [currentDestinyCost, setCurrentDestinyCost] = useState<number>(1)
		const rollInterval:RefObject<NodeJS.Timeout|null> = useRef(null)

	const handleRoll = () => {
		if (diceState == DiceState.TO_ROLL) {
			setDiceState(DiceState.ROLLING)
			socket.emit(
				"updateDiceStateServer", 
				{
					id:	id,
					state:	DiceState.ROLLING				
				}
			)
		}
		if (diceState == DiceState.ROLLING) {
			const finalDiceValue = getRandomIntInclusive(0,maxValue)
			socket.emit(
				"updateDiceStateServer", 
				{
					id:	id,
					state:	DiceState.ROLLED,
					value: 	finalDiceValue		
				}
			)
		}
	}

	socket.on("updateDiceStateClient", (data:UpdateDiceStateRequest) => {
		if (id == data.id) {
			if (data.value) {
				console.log("Update with value :" + data.value)
				setValue(data.value)
				setTotalRollValue(totalRollValue + data.value)
				setActiveDiceNumber(activeDiceNumber - 1)
			}
			setDiceState(data.state)
		}
	})

	const useDestinyPoints = () => {
		setCurrentDestiny(currentDestiny - currentDestinyCost)
		setCurrentDestinyCost(currentDestinyCost + 1)
		socket.emit(
			"updateStatsServer",
			{
				value:currentDestinyCost,
				targets:[targetId],
				currentStat: CurrentStatName.DESTINY,
				stat: StatName.DESTINY,
				type: IntegerUpdateOperation.REMOVE
			}
		)
		setTotalRollValue(totalRollValue - value)
		setValue(maxValue)
		setDiceState(DiceState.TO_ROLL)
		setActiveDiceNumber(activeDiceNumber + 1)
	}

	useEffect(() => {
		if (diceState == DiceState.ROLLING) {
			console.log("start anim")
			rollInterval.current=setInterval(() => {
				setValue(getRandomIntInclusive(0, maxValue));
			}, 100);
		}
		if (diceState == DiceState.ROLLED && rollInterval.current) {
			clearInterval(rollInterval.current)
		}
  }, [diceState])

	return(
		<div className="flex flex-1 text-center justify-center">
			{
				canInteract
				?
					diceState == DiceState.ROLLED
					?
					<div className="flex flex-col gap-2">
						<span>{value}</span>
						{
							currentDestiny >= currentDestinyCost
							?
								<Button
									onClick={useDestinyPoints}
									className="cursor-pointer bg-emerald-500 text-white-500 hover:bg-emerald-800 ">
									{currentDestinyCost}
								</Button>
							:
								null
						}
					</div>
					:
						<Button onClick={handleRoll} className="cursor-pointer">{value}</Button>
				:
					<span>
						{
							diceState ==DiceState.TO_ROLL
							?
								"?"
							:
								value
						}
					</span>
			}
		</div>
	)
}
import { Button } from "@/components/ui/button";
import { socket } from "@/socket";
import { DiceRollData, UpdateDiceStateRequest } from "@/sockets/dice";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";

interface DiceProps{
	maxValue:number
	totalRollValue:number
	setTotalRollValue:Dispatch<SetStateAction<number>>
	canInteract:boolean
	diceRollData:DiceRollData,
	id:number
}

export enum DiceState {
	TO_ROLL,
	ROLLING,
	ROLLED
}

function getRandomIntInclusive(min:number, max:number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}


export function Dice({
		maxValue,
		totalRollValue,
		setTotalRollValue,
		canInteract,
		diceRollData,
		id
	}:DiceProps){
		const [value, setValue] = useState<number>(maxValue)
		const [diceState, setDiceState] = useState<DiceState>(DiceState.TO_ROLL)
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
			setDiceState(data.state)
			if (data.value) {
				setValue(data.value)
				setTotalRollValue(totalRollValue + data.value)
			}
		}
	})

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
						<span>{value}</span>
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
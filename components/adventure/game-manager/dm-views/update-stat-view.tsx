"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Character } from "@prisma/client"
import { useState } from "react"
import { MenuType } from "../dm-view"
import { socket } from "@/socket"
import { CurrentStatName, StatName, UpdateStat, UpdateType } from "@/data/stats"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { IntegerUpdateOperation } from "@/data/operation"

interface AddDamageType {
	interactionTargets:Character[],
	removeInteractionTarget: (targetId:number)=> void,
	updateInteraction:(menu:MenuType, status:boolean) => void,
	updateStat:UpdateStat
}

interface UpdateStatType {
	name: string,
	stat: StatName,
	currentStat: CurrentStatName
}

const updateStatsType:UpdateStatType[] = [
	{
		name:"vitalité",
		stat:StatName.VITALITY,
		currentStat:CurrentStatName.VITALITY,
	},
	{
		name:"mana",
		stat:StatName.MANA,
		currentStat:CurrentStatName.MANA,
	},
	{
		name:"corruption",
		stat:StatName.CORRUPTION,
		currentStat:CurrentStatName.CORRUPTION,
	},
	{
		name:"destin",
		stat:StatName.DESTINY,
		currentStat:CurrentStatName.DESTINY,
	},
]


export function UpdateStatView(
		{
			interactionTargets,
			removeInteractionTarget,
			updateInteraction,
			updateStat
		}:AddDamageType
){

	const [updateValue, setUpdateValue] = useState<string>("")
	const [currentUpdateStatsType, setCurrentUpdateStatsType] =	useState<UpdateStatType>(updateStatsType[updateStat])
	const [operationValue, setOperationValue] = useState<IntegerUpdateOperation>(IntegerUpdateOperation.ADD)
	const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		if ((!isNaN(Number(event.target.value))) || event.target.value=="") {
			setUpdateValue(event.target.value)
		}
	}

	const handleOperationValueChange = (value:string) => {
		setOperationValue(parseInt(value))
	}

	async function handleSubmit() {
		socket.emit(
			"updateStatsServer",
			{
				value:parseInt(updateValue),
				targets:interactionTargets.map((interactionTarget) => interactionTarget.id),
				currentStat: currentUpdateStatsType.currentStat,
				stat: currentUpdateStatsType.stat,
				type: operationValue
			}
		)
	}

	socket.on("updateStatsClient", () => {
		updateInteraction(MenuType.Main, false)
	})
	

	return(
		<>
			<h1 className="text-center text-2xl text-bold pb-5">{"Modifier " + currentUpdateStatsType.name}</h1>
			<div className="flex-1">
				<div className="flex justify-around pb-4">
					<h2 className="flex-1 text-center">Cibles</h2>
					<h2 className="flex-1 text-center">{currentUpdateStatsType.name[0].toUpperCase() + currentUpdateStatsType.name.substring(1)}</h2>
					<h2 className="flex-1"></h2>
					<div className="flex-1"></div>
				</div>
				<div className="flex-2 flex justify-around">
					<div className=" flex flex-1 flex-wrap gap-5 justify-around">
						{interactionTargets.map((interactionTarget) =>  (
								<Badge
									key={"interactionTarget" + interactionTarget.id.toString()}
									className="basis-1/3 cursor-pointer hover:bg-red-500"
									onClick={() => removeInteractionTarget(interactionTarget.id)}
								>
									{interactionTarget.name}
								</Badge>
							)
						)}
					</div>
					<div className="flex justify-center flex-1">
						<Input
							onChange={handleChange}
							value={updateValue}
						/>
					</div>
					<div className="flex-1 flex justify-center">
						<RadioGroup defaultValue="add" onValueChange={handleOperationValueChange}>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value={IntegerUpdateOperation.ADD.toString()} id="add" className="cursor-pointer"/>
								<Label htmlFor="add" className="cursor-pointer">Ajout</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value={IntegerUpdateOperation.REMOVE.toString()} id="remove" className="cursor-pointer"/>
								<Label htmlFor="remove" className="cursor-pointer">Suppression</Label>
							</div>
						</RadioGroup>
					</div>
					<div className="flex justify-center align-center flex-1">
						<Button onClick={handleSubmit} className="cursor-pointer">Appliquer</Button>
					</div>
				</div>
			</div>
		</>
	)
}

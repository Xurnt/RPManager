import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Character } from "@prisma/client"
import { useState } from "react"
import { MenuType } from "../dm-view"

interface AddDamageType {
	interactionTargets:Character[],
	removeInteractionTarget: (targetId:number)=> void,
	updateInteraction:(menu:MenuType, status:boolean) => void,
	updateType:UpdateType,
	updateStat:UpdateStat
}

interface UpdateStatType {
	name: string,
	stat: StatName,
	currentStat: CurrentStatName
}

interface UpdateStatsType{
	updateStat:UpdateStatType
	updateType:string
}

export enum UpdateType{
	ADD=0,
	REMOVE=1
}

export enum UpdateStat{
	VITALITY=0,
	MANA=1
}

export enum CurrentStatName {
	VITALITY="currentVitality",
	MANA="currentMana"
}

export enum StatName {
	VITALITY="vitality",
	MANA="mana"
}

const updateStatsType:UpdateStatsType[][] = [
	[
		{
			updateStat:
				{
					name:"vitalité",
					stat:StatName.VITALITY,
					currentStat:CurrentStatName.VITALITY,
				},
			updateType:"Récupérer"
		},
		{
			updateStat:
				{
					name:"vitalité",
					stat:StatName.VITALITY,
					currentStat:CurrentStatName.VITALITY,
				},
			updateType:"Retirer"
		},
	],
	[
		{
			updateStat:
				{
					name:"mana",
					stat:StatName.MANA,
					currentStat:CurrentStatName.MANA,
				},
			updateType:"Récupérer"
		},
		{
			updateStat:
				{
					name:"mana",
					stat:StatName.MANA,
					currentStat:CurrentStatName.MANA,
				},
			updateType:"Retirer"
		},
	]
]


export function UpdateStatView(
		{
			interactionTargets,
			removeInteractionTarget,
			updateInteraction,
			updateType,
			updateStat
		}:AddDamageType
){

	const [updateValue, setUpdateValue] = useState<string>("")
	const [currentUpdateStatsType, setCurrentUpdateStatsType] =	useState<UpdateStatsType>(updateStatsType[updateStat][updateType])
	const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		if ((!isNaN(Number(event.target.value))) || event.target.value=="") {
			setUpdateValue(event.target.value)
		}
	}

	async function handleSubmit() {
		const response = await fetch('/api/updateStat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(
				{
					value:parseInt(updateValue),
					targets:interactionTargets.map((interactionTarget) => interactionTarget.id),
					currentStat: currentUpdateStatsType.updateStat.currentStat,
					type: updateType,
					stat: currentUpdateStatsType.updateStat.stat,
				}
			),
		})
		if (response.status == 200) {
			updateInteraction(MenuType.Main, false)
		}
	}

	return(
		<>
			<h1 className="text-center text-2xl text-bold pb-5">{currentUpdateStatsType.updateType + " " + currentUpdateStatsType.updateStat.name}</h1>
			<div className="flex-1">
				<div className="flex justify-around pb-4">
					<h2 className="flex-1 text-center">Cibles</h2>
					<h2 className="flex-1 text-center">{currentUpdateStatsType.updateStat.name[0].toUpperCase() + currentUpdateStatsType.updateStat.name.substring(1)}</h2>
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
					<div className="flex justify-center align-center flex-1">
						<Button onClick={handleSubmit} className="cursor-pointer">Appliquer</Button>
					</div>
				</div>
			</div>
		</>
	)
}

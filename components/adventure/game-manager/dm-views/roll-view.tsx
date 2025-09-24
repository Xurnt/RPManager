import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Character } from "@prisma/client"
import { useState } from "react"
import { Plus } from 'lucide-react';
import { Minus } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { MenuType } from "../dm-view"

export enum RollType {
	Stat,
	Magic,
	Standard
}

interface RollViewType {
	rollType:RollType
	interactionTargets:Character[],
	removeInteractionTarget: (targetId:number)=> void,
	updateInteraction:(menu:MenuType, status:boolean) => void,
}
interface Stat{
	name:string
	pgName:string
}

const stats:Stat[] = [
	{
		name:"Vitalité",
		pgName: "currenVitality"
	},
	{
		name:"Mana",
		pgName: "currenMana"
	},
		{
		name:"Force",
		pgName: "strength"
	},
		{
		name:"Dextérité",
		pgName: "dexterity"
	},
		{
		name:"Sang-froid",
		pgName: "courage"
	},
		{
		name:"Charisme",
		pgName: "charisma"
	},
		{
		name:"Perception",
		pgName: "perception"
	},
	{
		name:"Discrétion",
		pgName: "discretion"
	},
	{
		name:"Savoir",
		pgName: "knowledge"
	},
]

enum BonusMalusOperation {
	BONUS="+",
	MALUS="-"
}

enum BonusMalusListAction {
	ADD,
	REMOVE
}

interface BonusMalus{
	operation: BonusMalusOperation,
	value:number,
	id:number
}

export function RollView({
	rollType,
	interactionTargets,
	removeInteractionTarget,
	updateInteraction
}:RollViewType){

	const [stat, setStat] = useState<string>("")
	const [bonusMalusValue, setBonusMalusValue] = useState<string>("")
	const [bonusMalusIndex, setBonusMalusIndex] = useState<number>(1)
	const [bonusMalusList, setBonusMalusList] = useState<BonusMalus[]>([])
	const [successScore, setSuccessScore] = useState<string>("")

	const handleBonusMalusChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		if ((!isNaN(Number(event.target.value))) || event.target.value=="") {
			setBonusMalusValue(event.target.value)
		}
	}

	const handleStatChange = (value:string) => {
		setStat(value)
	}

	const handleSuccessScore = (event:React.ChangeEvent<HTMLInputElement>) => {
		if ((!isNaN(Number(event.target.value))) || event.target.value=="") {
			setSuccessScore(event.target.value)
		}
	}
	interface UpdateBonusMalusListOption {
		operationValue?:BonusMalusOperation, 
		id?:number
	}

	const updateBonusMalusList = (action:BonusMalusListAction, option:UpdateBonusMalusListOption) => {
		var tempBonusMalusList = [...bonusMalusList]
			if(action == BonusMalusListAction.ADD && option.operationValue && bonusMalusValue != "") {
				tempBonusMalusList.push({
					operation:option.operationValue,
					id: bonusMalusIndex,
					value: parseInt(bonusMalusValue)
				})
				setBonusMalusIndex(bonusMalusIndex + 1)
			}
			if(action == BonusMalusListAction.REMOVE && option.id) {
				const bonusMalusToRemoveIndex = tempBonusMalusList.findIndex((bonusMalus) => bonusMalus.id == option.id)
				console.log(bonusMalusToRemoveIndex)
				tempBonusMalusList.splice(bonusMalusToRemoveIndex, 1)
			}
		setBonusMalusList(tempBonusMalusList)
	}



	async function handleSubmit() {
		const response = await fetch('/api/diceRoll', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(
				{
					targets:interactionTargets.map((interactionTarget) => interactionTarget.id),
					bonusMalusList: bonusMalusList,
					stat: stat,
					successScore:successScore
				}
			),
		})
		if (response.status == 200) {
			updateInteraction(MenuType.Main, false)
		}
	}

	return(
		<div>
				<div className="flex justify-around pb-4">
					<h2 className="flex-1 text-center">Cibles</h2>
					{
						rollType == RollType.Stat
						?
							<h2 className="flex-1 text-center">Statistique</h2>
						:
							null
					}
					<h2 className="flex-1 text-center">Bonus/Malus</h2>
					<h2 className="flex-1 text-center">Score à atteindre</h2>
					<div className="flex-1"></div>
				</div>
				<div className="flex-1 flex justify-around">
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
					{
						rollType == RollType.Stat
						?
							<div className="flex-1 flex justify-around items-center">
								<Select
									value={stat}
									onValueChange={handleStatChange}
								>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Selectionner une stat" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{
												stats.map((stat) => (
													<SelectItem
														key={"stat_" +stat.pgName}
														value={stat.pgName}
													>
															{stat.name}
													</SelectItem>
												))
											}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						: null
					}
					<div className="flex-1 flex justify-around gap-4 items-center">
						<Input
							onChange={handleBonusMalusChange}
							value={bonusMalusValue}
						/>
						<div className="flex flex-col gap-1">
							<Button
								size="icon"
								className="cursor-pointer"
								onClick={() => updateBonusMalusList(BonusMalusListAction.ADD, {operationValue:BonusMalusOperation.BONUS})}
							>
								<Plus/>
							</Button>
							<Button
								size="icon"
								className="cursor-pointer"
								onClick={() => updateBonusMalusList(BonusMalusListAction.ADD, {operationValue:BonusMalusOperation.MALUS})}
							>
								<Minus/>
							</Button>
						</div>
					</div>
					<div className="flex-1 flex justify-around items-center">
						<Input
							className="mx-10"
							onChange={handleSuccessScore}
							value={successScore}
						/>
					</div>
					<div className="flex-1 flex justify-around items-center">
						<Button onClick={handleSubmit} className="cursor-pointer">Appliquer</Button>
					</div>
				</div>
				<div className="flex pt-5">
					<div className="flex-1 flex justify-around items-center"></div>
					<div className="flex-1 flex justify-around items-center"></div>
					<div className="flex flex-1 flex-wrap gap-5 justify-around">
						{bonusMalusList.map((bonusMalus) =>  (
								<Badge
									key={"bonusMalus" + bonusMalus.id.toString()}
									className={"basis-1/3 cursor-pointer " + (bonusMalus.operation == BonusMalusOperation.BONUS? "bg-green-500 hover:bg-green-800" : "bg-red-500 hover:bg-red-800")}
									onClick={() => updateBonusMalusList(BonusMalusListAction.REMOVE, {id:bonusMalus.id})}
								>
									{bonusMalus.operation + " " + bonusMalus.value}
								</Badge>
							)
						)}
					</div>
					<div className="flex-1 flex justify-around items-center"></div>
					<div className="flex-1 flex justify-around items-center"></div>
				</div>
		</div>
	)

}

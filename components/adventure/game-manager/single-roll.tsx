import { DiceRollData, SetManaUsageRequest, UpdateDiceStateRequest } from "@/sockets/dice";
import { Dice } from "./dice";
import { RollType, stats } from "@/data/roll";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Character } from "@/generated/prisma";
import { toast } from "sonner"
import { motion } from "motion/react"
import { UserData } from "@/components/client-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { socket } from "@/socket";
interface SingleRollProps{
	diceRollData:DiceRollData
	interactionTargets:Character[],
	canInteract:boolean,
	userData:UserData
}

export function SingleRoll({
		diceRollData,
		interactionTargets,
		canInteract,
		userData
	}:SingleRollProps){

		const [totalRollValue, setTotalRollValue] = useState<number>(diceRollData.bonusMalusValue)
		const [activeDiceNumber, setActiveDiceNumber] = useState<number>(diceRollData.diceIds.length)
		const [isInputingMana, setIsInputingMana] = useState<boolean>(true)
		const [manaUsage, setManaUsage] = useState<string>("")

		const handleManaUsageChange = (event:React.ChangeEvent<HTMLInputElement>) => {
			if ((!isNaN(Number(event.target.value))) || event.target.value=="") {
				setManaUsage(event.target.value)
			}
		}

		const handleConfirmManaUsage = () => {
			if (diceRollData.maxManaUsage) {
				if (parseInt(manaUsage) > diceRollData.maxManaUsage) {
					toast("T'as pas assez de mana bebou :(")
				} else {
					setIsInputingMana(false)
					const data:SetManaUsageRequest = {
						id:diceRollData.id,
						characterId:diceRollData.target,
						mana:manaUsage
					}
					socket.emit("setManaUsageServer", data)
				}
			}
		}

		socket.on("setManaUsageClient", (data:SetManaUsageRequest) => {
			console.log("aaaaaaaaaaaaaaaaa")
			if (data.id==diceRollData.id) {
			console.log("bbbbbbbbbbbbbbb")
				setManaUsage(data.mana)
				setTotalRollValue(totalRollValue + parseInt(data.mana))
				socket.emit("getCharactersServer")
			}
		})
		


	return(
	<Card className={
		"flex flex-col gap-2 " +
			(
				userData.characterId == diceRollData.target
				?
					"bg-slate-800 border-3"
				:
					""
			)
		}>
		<h1 className="text-center text-base font-bold">Jet de {interactionTargets.filter((interactionTarget) => interactionTarget.id ==  diceRollData.target)[0].name}</h1>
		{
				diceRollData.type == RollType.Magic && isInputingMana && userData.characterId==diceRollData.target
				?
					<div className="flex px-4">
						<div className="flex gap-2 flex-4 flex-col">
							<div className="flex gap-2 align-center justify-around ">
								<span className="flex flex-1 justify-center text-center items-center">Mana à utiliser</span>
								<span className="flex flex-1 justify-center text-center items-center"></span>
							</div>
							<div className="flex gap-2 align-center justify-around ">
								<Input onChange={handleManaUsageChange} className="flex-1" value={manaUsage} />
								<div className="flex-1 flex justify-center">
									<Button
										onClick={handleConfirmManaUsage}
										className="cursor-pointer"
									>
										Zeparti
									</Button>
								</div>
							</div>
						</div>
					</div>
				:
					<div className="flex px-4">
						<div className="flex gap-2 flex-4 flex-col">
							<div className="flex gap-2 align-center justify-around ">
								{
									diceRollData.statName
									?
										<span className="flex flex-1 text-center justify-center items-center text-sm">Dé de {stats.filter((stat) => stat.pgName == diceRollData.statName)[0].name.toLowerCase()}</span>
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
								{
									diceRollData.type==RollType.Magic
									?
										<span className="flex flex-1 justify-center text-center items-center">Bonus de mana</span>
									:
										null
								}
								<span className="flex flex-1 justify-center text-center items-center">Résultat</span>
								<span className="flex flex-1 justify-center text-center items-center">Objectif</span>
							</div>
							<div className="flex gap-4 align-center justify-around ">
								{
									diceRollData.statDiceValue
									?
										<Dice
											totalRollValue={totalRollValue}
											setTotalRollValue={setTotalRollValue}
											maxValue={diceRollData.statDiceValue}
											canInteract={canInteract}
											id={diceRollData.diceIds[0]}
											setActiveDiceNumber={setActiveDiceNumber}
											activeDiceNumber={activeDiceNumber}
										/>
									:
										null
								}
								<Dice
									totalRollValue={totalRollValue}
									setTotalRollValue={setTotalRollValue}
									maxValue={100}
									canInteract={canInteract}
									id={diceRollData.diceIds[1]}
									setActiveDiceNumber={setActiveDiceNumber}
									activeDiceNumber={activeDiceNumber}
								/>
								{
									diceRollData.bonusMalusValue != 0
									?
										<span className="flex flex-1 justify-center text-center items-center">
											{diceRollData.bonusMalusValue}
										</span>
									:
										null
								}
								{
									diceRollData.type==RollType.Magic
									?
										<span className="flex flex-1 justify-center text-center items-center">
											{
												manaUsage == ""
												?
													"?"
												:
													manaUsage
											}
										</span>
									:
										null
								}
								<span className="flex flex-1 justify-center text-center items-center">{totalRollValue}</span>
								<span className="flex flex-1 justify-center text-center items-center">{diceRollData.successScore}</span>
							</div>
						</div>
						<div className="flex flex-col gap-4 flex-1 justify-end">
							{
								activeDiceNumber == 0
								?
									<motion.h2 className="text-center text-lg font-bold" initial={{ scale: 0 }} animate={{ scale: 1 }} >
										{
												totalRollValue < diceRollData.successScore
												?
													"GRONAZ"
												:
													"GG BG"
										}
									</motion.h2>
								:
									null
							}
						</div>
					</div>
			}
		
		
		

	</Card>

	)
}
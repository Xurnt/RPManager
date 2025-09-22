import { Character, GameSession } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { UpdateStat, UpdateStatView, UpdateType } from "./dm-views/update-stat-view";

interface DmViewType {
	gameSession:GameSession,
	setNewInteraction: Dispatch<SetStateAction<boolean>>,
	interactionTargets:Character[],
	newInteraction:boolean,
	setInteractionTargets:Dispatch<SetStateAction<Character[]>>
}

export enum MenuType {
	Main,
	DamageApplication,
	Healing,
	ManaConsumption,
	ManaRestauration
}

export function DmView(
	{
		gameSession,
		setNewInteraction,
		newInteraction,
		interactionTargets,
		setInteractionTargets
	}:DmViewType){

	const [gameActive, setGameActive] = useState<boolean>(gameSession.isActive)
	const [menuType, setMenuType] = useState<MenuType>(MenuType.Main)

	async function toggleGameSession (status:boolean) {
		const response = await fetch('/api/gameSessionUpdate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({sessionId:gameSession.id, sessionStatus:status}),
		})
		if (response.status == 200) {
			setGameActive(status)
		}
	}

	const updateInteraction = (menu:MenuType, status:boolean = true) => {
		setMenuType(menu)
		setNewInteraction(status)
		if (!status) {
			setInteractionTargets([])
		}
	}
	const removeInteractionTarget = (targetId:number) => {
		var tempInteractionTargets= [...interactionTargets]
		tempInteractionTargets.splice(interactionTargets.findIndex((interactionTarget) => interactionTarget.id == targetId), 1)
		setInteractionTargets(tempInteractionTargets)
	}

	return(
		<>
			{
				!gameActive
				?
					<div className="flex justify-center items-center h-full">
						<Button onClick={() => toggleGameSession(true)} className="text-xl p-6 cursor-pointer">Commencer la session</Button>
					</div>
				:
					<div className="flex flex-col h-full">
						<div className={"pb-5 flex " + (newInteraction? "justify-between" : "justify-end")}>
							{
								newInteraction
								?
									<Button onClick={() => updateInteraction(MenuType.Main, false)} className="text-sm cursor-pointer bg-red-500 text-white-500 hover:bg-red-800  hover:text-white-800">Annuler interaction</Button>
								:
									null
							}
							<Button onClick={() => toggleGameSession(false)} className="text-sm cursor-pointer">Arrêter la session</Button>
						</div>
						<div className="flex flex-1">
							{
								menuType == MenuType.Main
								?
								<div className="flex flex-col justify-around">
									<Button onClick={() => updateInteraction(MenuType.DamageApplication)} className="text-sm cursor-pointer bg-red-500 text-white-500 hover:bg-red-800  hover:text-white-800">Appliquer dégats</Button>
									<Button onClick={() => updateInteraction(MenuType.Healing)} className="text-sm cursor-pointer bg-green-500 text-white-500 hover:bg-green-800  hover:text-white-800">Soigner</Button>
									<Button onClick={() => updateInteraction(MenuType.ManaConsumption)} className="text-sm cursor-pointer bg-purple-500 text-white-500 hover:bg-purple-800  hover:text-white-800">Consommer mana</Button>
									<Button onClick={() => updateInteraction(MenuType.ManaRestauration)} className="text-sm cursor-pointer bg-blue-500 text-white-500 hover:bg-blue-800  hover:text-white-800">Restaurer Mana</Button>
								</div>
								:
									<div className="flex flex-col w-full">
										<div className="flex flex-col flex-1">
											{
												menuType == MenuType.DamageApplication
												?
													<UpdateStatView
														interactionTargets={interactionTargets}
														removeInteractionTarget={removeInteractionTarget}
														updateInteraction={updateInteraction}
														updateStat={UpdateStat.VITALITY}
														updateType={UpdateType.REMOVE}
													/>
												:
													null
											}
											{
												menuType == MenuType.Healing
												?
													<UpdateStatView
														interactionTargets={interactionTargets}
														removeInteractionTarget={removeInteractionTarget}
														updateInteraction={updateInteraction}
														updateStat={UpdateStat.VITALITY}
														updateType={UpdateType.ADD}
													/>
												:
													null
											}
											{
												menuType == MenuType.ManaConsumption
												?
													<UpdateStatView
														interactionTargets={interactionTargets}
														removeInteractionTarget={removeInteractionTarget}
														updateInteraction={updateInteraction}
														updateStat={UpdateStat.MANA}
														updateType={UpdateType.REMOVE}
													/>
												:
													null
											}
											{
												menuType == MenuType.ManaRestauration
												?
													<UpdateStatView
														interactionTargets={interactionTargets}
														removeInteractionTarget={removeInteractionTarget}
														updateInteraction={updateInteraction}
														updateStat={UpdateStat.MANA}
														updateType={UpdateType.ADD}
													/>
												:
													null
											}
										</div>
									</div>

							}
						</div>
					</div>
			}
		</>

	)
}
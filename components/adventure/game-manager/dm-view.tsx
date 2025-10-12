import { Character, GameSession } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RollCreationView } from "./dm-views/roll-creation-view";
import { RollView } from "./roll-view";
import { DiceRollData } from "@/sockets/dice";
import { UserData } from "@/components/client-layout";
import { socket } from "@/socket";
import { RollType } from "@/data/roll";
import { UpdateStat } from "@/data/stats";
import { UpdateStatView } from "./dm-views/update-stat-view"
import { UpdateTextView } from "./dm-views/update-text-view"
import { DefaultPlayerInteraction, InteractionType } from "./dm-views/default-player-interaction"

interface DmViewType {
	gameSession:GameSession,
	setNewInteraction: Dispatch<SetStateAction<boolean>>,
	interactionTargets:Character[],
	newInteraction:boolean,
	setInteractionTargets:Dispatch<SetStateAction<Character[]>>
	rollData:DiceRollData[],
	setRollData:Dispatch<SetStateAction<DiceRollData[]>>,
	userData:UserData,
	characters:Character[]
}

export enum MenuType {
	Main,
	UpdateVitality,
	UpdateMana,
	UpdateCorruption,
	UpdateDestiny,
	RollCreation,
	RollView,
	DisconnectPlayer,
	UnselectCharacter,
	UpdateText
}

export function DmView(
	{
		gameSession,
		setNewInteraction,
		newInteraction,
		interactionTargets,
		setInteractionTargets,
		rollData,
		setRollData,
		userData,
		characters
		
	}:DmViewType){

	const [menuType, setMenuType] = useState<MenuType>(MenuType.Main)
	const [rollMenuType, setRollMenuType] = useState<RollType>(RollType.Standard)


	async function toggleGameSession (status:boolean) {
		// const response = await fetch('/api/gameSessionUpdate', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({sessionId:gameSession.id, sessionStatus:status}),
		// })
		// if (response.status == 200) {
		// 	setGameActive(status)
		// }
		socket.emit(
			"updateGameSessionServer",
			{
				sessionId:gameSession.id,
				sessionStatus:status
			}
		)
	}

	socket.on("updateGameSessionClient", () => {
		socket.emit("getGameSessionServer", {sessionId:gameSession.id})
	})

	socket.on("updateCharacterSelectabilityClient", () => {
		socket.emit("getGameSessionServer", {sessionId:gameSession.id})
	})

	const updateInteraction = (menu:MenuType, status:boolean = true) => {
		setMenuType(menu)
		setNewInteraction(status)
		if (!status) {
			setInteractionTargets([])
			socket.emit("stopInteraction")
		}
	}
	const removeInteractionTarget = (targetId:number) => {
		var tempInteractionTargets= [...interactionTargets]
		tempInteractionTargets.splice(interactionTargets.findIndex((interactionTarget) => interactionTarget.id == targetId), 1)
		setInteractionTargets(tempInteractionTargets)
	}

	const openRollMenu = (rollType:RollType) => {
		setRollMenuType(rollType)
		updateInteraction(MenuType.RollCreation)
	}

	const handleCharacterSelectabilityToggle = (value:boolean) => {
		socket.emit("updateCharacterSelectabilityServer",
			{
				sessionId: gameSession.id,
				characterSelectable: value
			})
	}

	return(
		<>
			{
				!gameSession.isActive
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
								<div className="flex justify-around w-full py-10 gap-8">
									<div className="flex flex-1 flex-col justify-start gap-8">
										<h1 className="text-center">Setup</h1>
										<Toggle pressed={gameSession.isCharacterSelectionAllowed} onPressedChange={handleCharacterSelectabilityToggle} className="text-sm cursor-pointer text-white-500">Activer sélection de personnage</Toggle>
										<Button onClick={() => updateInteraction(MenuType.DisconnectPlayer)} className="text-sm cursor-pointer bg-green-600 text-white-500 hover:bg-green-900  hover:text-white-800">Déconnecter joueur</Button>
										<Button onClick={() => updateInteraction(MenuType.UnselectCharacter)} className="text-sm cursor-pointer bg-indigo-600 text-white-500 hover:bg-indigo-900  hover:text-white-800">Désélectionner personnage</Button>
										<Button onClick={() => updateInteraction(MenuType.UpdateText)} className="text-sm cursor-pointer bg-lime-700 text-white-500 hover:bg-lime-900  hover:text-white-800">Mettre à jour texte</Button>
									</div>
									<div className="flex flex-1 flex-col justify-start gap-8">
										<h1 className="text-center">Stats</h1>
										<Button onClick={() => updateInteraction(MenuType.UpdateVitality)} className="text-sm cursor-pointer bg-red-500 text-white-500 hover:bg-red-800  hover:text-white-800">Modifier vitalité</Button>
										<Button onClick={() => updateInteraction(MenuType.UpdateMana)} className="text-sm cursor-pointer bg-blue-500 text-white-500 hover:bg-blue-800  hover:text-white-800">Modifier mana</Button>
										<Button onClick={() => updateInteraction(MenuType.UpdateCorruption)} className="text-sm cursor-pointer bg-purple-500 text-white-500 hover:bg-purple-800  hover:text-white-800">Modifier corruption</Button>
										<Button onClick={() => updateInteraction(MenuType.UpdateDestiny)} className="text-sm cursor-pointer bg-zinc-500 text-white-500 hover:bg-zinc-800  hover:text-white-800">Modifier destin</Button>
									</div>
									<div className="flex flex-1 flex-col justify-start gap-8">
										<h1 className="text-center">Jets de dé</h1>
										<Button onClick={() => openRollMenu(RollType.Stat)} className="text-sm cursor-pointer bg-orange-500 text-white-500 hover:bg-orange-800  hover:text-white-800">Jet de statistique</Button>
										<Button onClick={() => openRollMenu(RollType.Magic)} className="text-sm cursor-pointer bg-pink-500 text-white-500 hover:bg-pink-800  hover:text-white-800">Jet de sort</Button>
										<Button onClick={() => openRollMenu(RollType.Standard)} className="text-sm cursor-pointer bg-cyan-500 text-white-500 hover:bg-cyan-800  hover:text-white-800">Jet normal</Button>
									</div>
								</div>
								:
									<div className="flex flex-col w-full">
										<div className="flex flex-col flex-1">
											{
												menuType == MenuType.UpdateVitality
												?
													<UpdateStatView
														interactionTargets={interactionTargets}
														removeInteractionTarget={removeInteractionTarget}
														updateInteraction={updateInteraction}
														updateStat={UpdateStat.VITALITY}
													/>
												:
													null
											}
											{
												menuType == MenuType.UpdateMana
												?
													<UpdateStatView
														interactionTargets={interactionTargets}
														removeInteractionTarget={removeInteractionTarget}
														updateInteraction={updateInteraction}
														updateStat={UpdateStat.MANA}
													/>
												:
													null
											}
											{
												menuType == MenuType.UpdateCorruption
												?
													<UpdateStatView
														interactionTargets={interactionTargets}
														removeInteractionTarget={removeInteractionTarget}
														updateInteraction={updateInteraction}
														updateStat={UpdateStat.CORRUPTION}
													/>
												:
													null
											}
											{
												menuType == MenuType.UpdateDestiny
												?
													<UpdateStatView
														interactionTargets={interactionTargets}
														removeInteractionTarget={removeInteractionTarget}
														updateInteraction={updateInteraction}
														updateStat={UpdateStat.DESTINY}
													/>
												:
													null
											}
											{
												menuType == MenuType.RollCreation
												?
													<RollCreationView
														rollType={rollMenuType}
														removeInteractionTarget={removeInteractionTarget}
														interactionTargets={interactionTargets}
														updateInteraction={updateInteraction}
														setRollData={setRollData}
													/>
												:
													null
											}
											{
												menuType == MenuType.RollView
												?
													<RollView 
														diceRollData={rollData}
														userData={userData}
														interactionTargets={interactionTargets}
													/>
												:
													null
											}
											{
												menuType == MenuType.DisconnectPlayer
												?
													<DefaultPlayerInteraction
														removeInteractionTarget={removeInteractionTarget}
														interactionTargets={interactionTargets}
														updateInteraction={updateInteraction}
														interaction={InteractionType.DISCONNECT}
													/>
												:
													null
											}
											{
												menuType == MenuType.UnselectCharacter
												?
													<DefaultPlayerInteraction
														removeInteractionTarget={removeInteractionTarget}
														interactionTargets={interactionTargets}
														updateInteraction={updateInteraction}
														interaction={InteractionType.UNSELECT_CHARACTER}
													/>
												:
													null
											}
											{
												menuType == MenuType.UpdateText
												?
													<UpdateTextView
														updateInteraction={updateInteraction}
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
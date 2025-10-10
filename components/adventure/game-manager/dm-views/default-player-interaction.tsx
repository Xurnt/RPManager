"use client"

import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Character } from "@prisma/client"
import { MenuType } from "../dm-view"
import { socket } from "../../../../socket"

export enum InteractionType {
	DISCONNECT,
	UNSELECT_CHARACTER
}

interface DefaultPlayerInteractionType {
	interactionTargets:Character[],
	removeInteractionTarget: (targetId:number)=> void,
	updateInteraction:(menu:MenuType, status:boolean) => void,
	interaction:InteractionType
}

export function DefaultPlayerInteraction(
	{
		interactionTargets,
		removeInteractionTarget,
		updateInteraction,
		interaction
	}: DefaultPlayerInteractionType
){

	
		async function handleSubmit() {
		switch (interaction) {
			case InteractionType.DISCONNECT:
				socket.emit(
					"forceDisconnectServer",
					{
						targets:interactionTargets.map((interactionTarget) => interactionTarget.id),
					}
				)
				break;
			case InteractionType.UNSELECT_CHARACTER:
				socket.emit(
					"removeCharacterServer",
					{
						targets:interactionTargets.map((interactionTarget) => interactionTarget.id),
					}
				)
				break;
			default:
				break;
		}

		}

	
	socket.on("forceDisconnectClient", () => {
		updateInteraction(MenuType.Main, false)
	})

	return(
		<>
			<h1 className="text-center text-2xl text-bold pb-5">
				{
					interaction == InteractionType.DISCONNECT
					?
						<>Déconnecter joueur(s)</>
					:
						null
				}
				{
					interaction == InteractionType.UNSELECT_CHARACTER
					?
						<>Déselectionner personnage</>
					:
						null
				}
			</h1>
			<div className="flex-1">
				<div className="flex justify-around pb-4">
					<h2 className="flex-1 text-center">Cibles</h2>
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
					<div className="flex justify-center align-center flex-1">
						<Button onClick={handleSubmit} className="cursor-pointer">Appliquer</Button>
					</div>
				</div>
			</div>
		</>
	)
}

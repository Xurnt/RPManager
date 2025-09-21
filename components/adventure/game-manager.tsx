import { GameSession } from "@prisma/client";
import { UserData } from "../client-layout";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";

interface GameManagerType {
	userData:UserData|null
	gameSession:GameSession
}

export function GameManager({userData, gameSession}:GameManagerType){

	const [gameActive, setGameActive] = useState<boolean>(gameSession.isActive)

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

	return(
		<Card className="block w-full h-full p-5">
			{userData == null ?
			<>
				<h1 className="text-3xl text-center pb-5">Aller connecte toi</h1>
				<p className="">Stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp stp</p>
			</>
			: userData.role == "dm"?
				!gameActive?
				<div className="flex justify-center items-center h-full">
					<Button onClick={() => toggleGameSession(true)} className="text-xl p-6 cursor-pointer">Commencer la session</Button>
				</div>
				:<div className="flex flex-col h-full">
					<div className="flex justify-end">
						<Button onClick={() => toggleGameSession(false)} className="text-sm cursor-pointer">Arrêter la session</Button>
					</div>
				</div>
				
			:<h1>TESSSSSSST</h1>
			}
		</Card>
	)
}
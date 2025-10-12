"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { socket } from "@/socket"
import { ChangeEvent, useEffect, useState } from "react"
import { MenuType } from "../dm-view"


interface UpdateTextViewProps {
	updateInteraction:(menu:MenuType, status:boolean) => void,
}

export function UpdateTextView({
	updateInteraction
}:UpdateTextViewProps){

	const [title, setTitle] = useState<string>("")
	const [core, setCore] = useState<string>("")

	const handleTitleChange = (event:ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
	}

	const handleCoreChange = (event:ChangeEvent<HTMLInputElement>) => {
		setCore(event.target.value)
	}

	async function handleSubmit() {
		socket.emit(
			"updateTextServer",
			{
				title:title,
				core:core
			}
		)
	}

	socket.on("updateTextClient", () => {
		updateInteraction(MenuType.Main, false)
	})
	


	useEffect(() => {
		socket.emit("getTextServer")
	},[])

	socket.on("getTextClient", (data:{title:string, core:string}) => {
		setTitle(data.title)
		setCore(data.core)
	})
	
	return(
		<>
			<h1 className="text-center text-2xl text-bold pb-5">Mettre à jour texte</h1>
			<div>
				<div className="flex justify-around pb-4 gap-4">
					<h2 className="flex-1 text-center">Titre</h2>
					<h2 className="flex-3 text-center">Message</h2>
					<div className="flex-1" />
				</div>
				<div className="flex justify-around pb-4 gap-4">
					<div className="flex justify-center flex-1">
						<Input
							onChange={handleTitleChange}
							value={title}
						/>
					</div>
					<div className="flex justify-center flex-3">
						<Input
							onChange={handleCoreChange}
							value={core}
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

import { socket } from "@/socket"
import { useEffect, useState } from "react"

export function TextDisplayView(){

	const [title, setTitle] = useState<string>("")
	const [core, setCore] = useState<string>("")

	useEffect(() => {
		socket.emit("getTextServer")
	},[])


	socket.on("updateTextClient", () => {
		socket.emit("getTextServer")
	})

	socket.on("getTextClient", (data:{title:string, core:string}) => {
		setTitle(data.title)
		setCore(data.core)
	})

	return(
	<div className="flex flex-col items-stretch flex-1">
		<h1 className="text-center text-xl font-bold italic pb-4">{title}</h1>
		<span>{core}</span>
	</div>

	)
}
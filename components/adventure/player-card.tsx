import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Character, User } from "@prisma/client"
import Image from 'next/image'
import { Progress } from "../ui/progress"
import { UserData } from "../client-layout"
import { Dispatch, SetStateAction } from "react"
import { Avatar, AvatarImage } from "../ui/avatar"
interface PlayerCardProps {
	character:Character
	user: User,
	isCurrentUser:boolean,
	isUserDm:boolean,
	className?:string,
	setInteractionTargets:Dispatch<SetStateAction<Character[]>>
	interactionTargets:Character[],
	newInteraction:boolean
}

export function PlayerCard(
	{
		character,
		user,
		isCurrentUser,
		isUserDm,
		className,
		setInteractionTargets,
		interactionTargets,
		newInteraction
	} : PlayerCardProps){

		const addNewInteractionTarget = () => {
			if (newInteraction && interactionTargets.filter((interactionTarget) => interactionTarget.id == character.id).length == 0) {
				setInteractionTargets([...interactionTargets, character])
			}
		}


	return(
<Card
	className={isUserDm ? "cursor-pointer" : ""}
	onClick={addNewInteractionTarget}
>
  <div className="flex justify-around items-center gap-4 px-5">
		<Avatar className="flex size-15">
			<AvatarImage className="flex object-cover" src={character.picturePath +"/thumbnail.jpg"} />
		</Avatar>
		<div className="flex flex-col justify-around items-end">
			<CardTitle className={"text-left " + (isCurrentUser? "text-3xl": "text-base")}>{character.name}</CardTitle>
			<CardDescription className={"text-left " + (isCurrentUser? "text-base": "text-xs")}>{user.name}</CardDescription>
		</div>
  </div>
  <CardContent>
		<div className="flex flex-col justify-around block">
			<span className="text-center text-sm block">{character.currentVitality}</span>
			<Progress className='[&>*]:bg-red-500' value={character.currentVitality * 100 /character.vitality}/>
			<span className="text-center text-sm block">{character.currentMana}</span>
			<Progress className='[&>*]:bg-blue-500' value={character.currentMana* 100 /character.mana}/>
		</div>

  </CardContent>
</Card>
	)
}
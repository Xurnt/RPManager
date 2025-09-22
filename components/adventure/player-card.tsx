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
	className={className + "flex max-h-full flex-col justify-stretch align-end gap-0 " + (isCurrentUser? "h-full flex-3": "") + (isUserDm ? "cursor-pointer" : "")}
	onClick={addNewInteractionTarget}
>
  <CardHeader className="flex flex-1 flex-col justify-around items-center">
    <CardTitle className={"text-center " + (isCurrentUser? "text-3xl": "text-base")}>{character.name}</CardTitle>
    <CardDescription className={"text-center " + (isCurrentUser? "text-base": "text-xs")}>{user.name}</CardDescription>
  </CardHeader>
  <CardContent className="flex flex-col flex-10 justify-around max-h-full">
    <Image
			objectFit="cover"
			className="flex-2 py-2 max-h-full"
			src={character.picturePath +"/thumbnail.jpg"}
			alt={character.name + " thumbnail"}
			width={200}
			height={200}
		/>
		<div className="flex flex-1 flex-col justify-around block">
			<span className="text-center text-sm block">{character.currentVitality}</span>
			<Progress className='[&>*]:bg-red-500' value={character.currentVitality * 100 /character.vitality}/>
			<span className="text-center text-sm block">{character.currentMana}</span>
			<Progress className='[&>*]:bg-blue-500' value={character.currentMana* 100 /character.mana}/>
		</div>

  </CardContent>
</Card>
	)
}
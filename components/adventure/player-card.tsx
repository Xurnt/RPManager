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
import { Progress } from "../ui/progress"
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
	className={
		"flex flex-col justify-stretch gap-2 " +
		(isUserDm ? "cursor-pointer" : "") +
		(isCurrentUser? "bg-slate-800 border-3":"")
	}
	onClick={addNewInteractionTarget}
>
  <div className="flex flex-3 justify-between items-center gap-4 px-5">
		<div className={"flex flex-1 justify-center"}>
			<Avatar className="size-15">
				<AvatarImage className="flex object-cover" src={character.picturePath +"/thumbnail.jpg"} />
			</Avatar>
		</div>
		<div className="flex flex-1 flex-col justify-around items-end">
			<CardTitle className={"text-left text-base"}>{character.name}</CardTitle>
			<CardDescription className={"text-left text-xs"}>{user.name}</CardDescription>
		</div>
  </div>
  <CardContent className="flex flex-1 gap-4">
		<div className="flex flex-col justify-around flex-1">
			<span className="text-center text-sm block">{character.currentVitality}</span>
			<Progress className='[&>*]:bg-red-500' value={character.currentVitality * 100 /character.vitality}/>
			<span className="text-center text-sm block">{character.currentMana}</span>
			<Progress className='[&>*]:bg-blue-500' value={character.currentMana* 100 /character.mana}/>
		</div>
		<div className="flex flex-col justify-around flex-1">
			<span className="text-center text-sm block">{character.corruption}</span>
			<Progress className='[&>*]:bg-purple-500' value={character.corruption}/>
			<span></span>
			<span></span>
		</div>

  </CardContent>
</Card>
	)
}
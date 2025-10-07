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
import { CircleQuestionMark } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
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
		"flex flex-col justify-stretch gap-1 " +
		(isUserDm ? "cursor-pointer" : "") +
		(isCurrentUser? "bg-slate-800 border-3":"")
	}
	onClick={addNewInteractionTarget}
>
	<div className="flex w-full justify-end px-5">
		
	</div>
  <div className="flex flex-3 justify-between items-center gap-4 px-5">
		<div className={"flex flex-1 justify-center"}>
			<Avatar className="size-15">
				<AvatarImage className="flex object-cover" src={character.picturePath +"/thumbnail.jpg"} />
			</Avatar>
		</div>
		<div className="flex flex-1 flex-col justify-around items-end">
			<CardTitle className={"text-left text-right"}>{character.name}</CardTitle>
			<CardDescription className={"text-right text-xs"}>{user.name}</CardDescription>
		</div>
		{
			isUserDm || isCurrentUser
			?
			<Tooltip>
				<TooltipTrigger>
					<CircleQuestionMark />
				</TooltipTrigger>
				<TooltipContent className="flex flex-col gap-2 max-w-[50vw] px-4 mx-4">
					<span className="text-left font-bold">Talent: {character.talentName}</span>
					{character.talentDescription.split("LINEBREAK").map((paragraph, paragraphIndex) => (
						<span
							key={"talentParagraph" + paragraphIndex}
							className="text-left mb-3 block">
								{paragraph}
						</span>
					))}
					<span className="text-left font-bold">Faiblesse: {character.weaknessName}</span>
					{character.weaknessDescription.split("LINEBREAK").map((paragraph, paragraphIndex) => (
						<span
							key={"weaknessParagraph" + paragraphIndex}
							className="text-left mb-3 block">
								{paragraph}
						</span>
					))}
				</TooltipContent>
			</Tooltip>
			:
				null
		}
  </div>
  <CardContent className="flex flex-1 gap-4">
		<div className="flex flex-col justify-around flex-1">
			<span className="text-center text-sm block">{character.currentVitality}</span>
			<Progress className='[&>*]:bg-red-500' value={character.currentVitality * 100 /character.vitality}/>
			<span className="text-center text-sm block">{character.currentMana}</span>
			<Progress className='[&>*]:bg-blue-500' value={character.currentMana* 100 /character.mana}/>
		</div>
		<div className="flex flex-col justify-around flex-1">
			<span className="text-center text-sm block">{character.currentCorruption}</span>
			<Progress className='[&>*]:bg-purple-500' value={character.currentCorruption* 100 /character.corruption}/>
			<span></span>
			<span></span>
		</div>

  </CardContent>
</Card>
	)
}
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
interface PlayerCardProps {
	character:Character
	user: User,
	isCurrentUser:boolean
}

export function PlayerCard({character,user, isCurrentUser} : PlayerCardProps){
	return(
<Card className={"flex flex-col justify-stretch gap-0 " + isCurrentUser? "h-full": "h-1/2"}>
  <CardHeader className="flex-1">
    <CardTitle className="text-center text-3xl">{character.name}</CardTitle>
    <CardDescription className="text-center">{user.name}</CardDescription>
  </CardHeader>
  <CardContent className="flex flex-col h-1/2 flex-11 justify-around">
    <Image
			className="flex max-h-4/5 w-auto"
			src={character.picturePath +"/thumbnail.jpg"}
			alt={character.name + " thumbnail"}
			width={500}
			height={500}
		/>
		<div className="flex flex-col justify-around block">
			<span className="text-center text-sm block">Vitalité</span>
			<Progress value={character.currentVitality * 100 /character.vitality}/>
			<span className="text-center text-sm block">Mana</span>
			<Progress value={character.currentMana* 100 /character.mana}/>
		</div>

  </CardContent>
</Card>
	)
}
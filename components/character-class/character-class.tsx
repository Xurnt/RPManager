import { Class, ClassCategory } from "@prisma/client";
import { Card } from "../ui/card";

interface CharacterClassProps {
	classes:Class[]
	category:ClassCategory
}


export function CharacterClass({classes, category}:CharacterClassProps): React.ReactNode {



	return (
		<div>
			<h1 className="scroll-m-20 text-left text-4xl font-bold tracking-tight text-balance">{category.name}</h1>
			<h2 className="scroll-m-20 text-left text-xl italic tracking-tight text-balance">{category.description}</h2>
			<div className="m-20">
				{
					classes.map((characterClass:Class) => (
						<Card key={"characterClass" + characterClass.id.toString()} className="my-10 px-8">
							<h3 className="scroll-m-20 text-left text-xl font-bold  tracking-tight text-balance">{characterClass.name}</h3>
							<p>{characterClass.description}</p>
						</Card>
					))
				}
			</div>
		</div>
	)
}
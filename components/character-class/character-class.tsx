import { Class, ClassCategory } from "@prisma/client";

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
						<div key={"characterClass" + characterClass.id.toString()} className="mt-10 mb-10">
							<h3 className="scroll-m-20 text-left text-xl font-bold  tracking-tight text-balance">{characterClass.name}</h3>
							<p>{characterClass.description}</p>
						</div>
					))
				}
			</div>
		</div>
	)
}
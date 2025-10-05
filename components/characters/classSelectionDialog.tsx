import { Dispatch, SetStateAction, useState } from "react"
import { Class, ClassCategory } from "@prisma/client";
import { UserData } from "../client-layout";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { socket } from "@/socket";


interface ClassSelectionDialogProps {
	categories:ClassCategory[]
	classes:Class[],
	userData:UserData,
	mainClassId:number,
	characterId:number,
	setDialogOpen:Dispatch<SetStateAction<boolean>>
}


export function ClassSelectionDialog({
	classes,
	categories,
	userData,
	mainClassId,
	characterId,
	setDialogOpen
	}:ClassSelectionDialogProps){
		const [mainCategoryId, setMainCategoryId] = useState<string>("")
		const [selectedClassId, setSelectedClassId] = useState<string>("")

		const handleMainCategoryChange = (value:string) => {
			setSelectedClassId("")
			setMainCategoryId(value)
		}

	const handleCharacterSelection = () => {
		socket.emit("selectCharacterServer", {
			userId:userData?.userId,
			characterId: characterId,
			secondaryClassId: parseInt(selectedClassId)
		})
		setDialogOpen(false)
	}

	return(
		<DialogContent>
			<DialogTitle>
				Choisi ta classe secondaire
			</DialogTitle>
			<div className="flex">
				<div className="flex-1">
					<div className="pb-4">
						<Select
							value={mainCategoryId}
							onValueChange={handleMainCategoryChange}
						>
							<SelectTrigger className="w-[180px] cursor-pointer">
								<SelectValue placeholder="Classe" />
							</SelectTrigger>
							<SelectContent>
								{
									categories.map((category) => (
										<Tooltip key={"secondaryCategoryOption" + category.id}>
											<TooltipTrigger>
												<SelectItem
													value={category.id.toString()}
													className="cursor-pointer"
												>
													{category.name}
												</SelectItem>
											</TooltipTrigger>
											<TooltipContent className="flex flex-col">
												<span>{category.description}</span>
											</TooltipContent>
										</Tooltip>
									))
								}
							</SelectContent>
						</Select>
					</div>
			
					{
						mainCategoryId != ""
						?
							<Select
								value={selectedClassId}
								onValueChange={setSelectedClassId}
							>
								<SelectTrigger className="w-[180px] cursor-pointer">
									<SelectValue placeholder="École" />
								</SelectTrigger>
								<SelectContent>
									{
										classes.filter(
											(classValue) => classValue.classCategoryId.toString() == mainCategoryId && classValue.id != mainClassId
										).map((classValue) => (
											<Tooltip key={"secondaryClassOption" + classValue.id}>
												<TooltipTrigger>
													<SelectItem
														value={classValue.id.toString()}
														className="cursor-pointer"
													>
														{classValue.name}
													</SelectItem>
												</TooltipTrigger>
												<TooltipContent className="flex flex-col">
													<span>{classValue.description}</span>
												</TooltipContent>
											</Tooltip>
										))
									}
								</SelectContent>
							</Select>
						:
							null
					}
				</div>
				<div className="flex-1 flex justify-center items-center">
					{
						mainCategoryId != "" && selectedClassId != ""
						?
							<Button
								className="text-lg font-bold cursor-pointer"
								onClick={handleCharacterSelection}
							>
								Letzgo
							</Button>
						:
							null
					}
				</div>
			</div>
		</DialogContent>
	)
}
"use client"

import { ReactElement, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import { Separator } from "./ui/separator";
import { Character, Class, ClassCategory } from "@prisma/client"
import { DataPages, Pages } from "@/data/pages";

interface ClientLayoutProps {
	characters:Character[],
	classCategories:ClassCategory[],
	classes:Class[]
}



export function ClientLayout(
	{
		characters,
		classCategories,
		classes
	}:ClientLayoutProps
):ReactElement {
	const [dataPage, setDataPage] = useState<DataPages>({page:Pages.Home})


	return(
		<SidebarProvider>
			<AppSidebar characters={characters} classcategories={classCategories} classes={classes} setDataPage={setDataPage} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{dataPage.page == Pages.Home? <h1>Home</h1> : null}
					{dataPage.page == Pages.Character? <h1>Character</h1> : null}
					{dataPage.page == Pages.Class? <h1>Class</h1> : null}
					{dataPage.page == Pages.World? <h1>World</h1> : null}
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

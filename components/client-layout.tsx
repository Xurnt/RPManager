"use client"

import { ReactElement, useEffect, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import { Separator } from "./ui/separator";
import { Character, Class, ClassCategory, User, UserRole } from "@prisma/client"
import { DataPages, Pages } from "@/data/pages";
import { CharacterClass } from "./character-class/character-class";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { LoginForm } from "./login-form";
import { useCookies } from 'react-cookie';
import { DmLayout } from "./adventure/dm-layout";
import { PlayerLayout } from "./adventure/player-layout";

export interface ClientLayoutProps {
	characters:Character[],
	classCategories:ClassCategory[],
	classes:Class[]
	users: (User & {UserRole:UserRole})[]
}

export interface UserData {
	userId: number,
	characterId?: number
}

export function ClientLayout(
	{
		characters,
		classCategories,
		classes,
		users
	}:ClientLayoutProps
):ReactElement {
	const [dataPage, setDataPage] = useState<DataPages>({page:Pages.Home})
	const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false)
	const [userData, setUserData] = useState<UserData|null>(null)
	const [cookie] = useCookies(['jwt'])
  useEffect(() => {
    fetch('/api/jwt')
      .then((res) => res.json())
      .then((data) => {
				if (data.userId) {
					const userData:UserData={
						userId:data.userId,
						characterId:data.characterId,
					}
					setUserData(userData)
				}
				else {
					setUserData(null)
				}
			})
  }, [cookie])

	return(

	<Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
		<SidebarProvider>
				<AppSidebar characters={characters} classcategories={classCategories} classes={classes} setDataPage={setDataPage} />
				<SidebarInset>
					<header className="p-10 justify-between flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">

						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mr-2 data-[orientation=vertical]:h-4"
							/>
						</div>
						{userData ? <h1>Connecté</h1>:
							<DialogTrigger asChild>
								<Button className="cursor-pointer">Connecte toi bébou :3</Button>
							</DialogTrigger>
						}

					</header>
					<DialogContent>
						<DialogTitle className="sr-only"/>
						<LoginForm setLoginDialogOpen={setLoginDialogOpen} />
					</DialogContent>
					<div className="flex flex-1 flex-col gap-4 p-14 pt-0">
						{dataPage.page == Pages.Home? (
							userData ? (
								users.filter((user) => user.id == userData?.userId)[0].UserRole.role == "dm"
								? <DmLayout />
								: <PlayerLayout users={users} characters={characters} userData={userData} />
							) : null
						): null
						}
						{dataPage.page == Pages.Character? <h1>Character</h1> : null}
						{
							dataPage.page == Pages.Class && dataPage.dataId
							?
								<CharacterClass
									classes={classes.filter((characterClass:Class)=>characterClass.classCategoryId == dataPage.dataId)}
									category={classCategories.filter((category:ClassCategory)=>category.id == dataPage.dataId)[0]}
								/>
							: null
						}
						{dataPage.page == Pages.World? <h1>World</h1> : null}
					</div>
				</SidebarInset>
		</SidebarProvider>
		</Dialog>
	)
}



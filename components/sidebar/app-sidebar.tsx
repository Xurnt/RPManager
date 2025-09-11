"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Character, Class, ClassCategory } from "@prisma/client"
import { Dispatch, SetStateAction } from "react"
import { DataPages, Pages } from "@/data/pages"

interface DataDrivenSidebar extends React.ComponentProps<typeof Sidebar> {
	characters:Character[],
	classcategories:ClassCategory[],
	classes:Class[],
	setDataPage: Dispatch<SetStateAction<DataPages>>
}

export function AppSidebar({ ...props }: DataDrivenSidebar) {

	const data = {
  navMain: [
		{
     	title: "Aventure",
			page: Pages.Home,
      url: "#",
      icon: SquareTerminal,
		},
    {
      title: "Personnages",
      url: "#",
      icon: SquareTerminal,
			page: Pages.Character,
      items: props.characters.map(
				(character:Character) => (
					{
						title: character.name,
						dataId: character.id
					}
				)
			)
    },
    {
      title: "Classes",
      url: "#",
      icon: Bot,
			page: Pages.Class,
      items: props.classcategories.map(
				(classCategory:ClassCategory) => (
					{
						title: classCategory.name,
						dataId: classCategory.id
					}
				)
			),
    },
    {
      title: "Univers",
      url: "#",
      icon: BookOpen,
			page: Pages.World,
      items: [
        {
          title: "Introduction",
        },
        {
          title: "Get Started",
        },
        {
          title: "Tutorials",
        },
        {
          title: "Changelog",
        },
      ],
    }
  ],
}
	const {characters, classcategories, classes, setDataPage, ...sidebarProps } = props
  return (
    <Sidebar collapsible="icon" {...sidebarProps}>
      <SidebarContent>
        <NavMain items={data.navMain} setDataPage={props.setDataPage}/>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

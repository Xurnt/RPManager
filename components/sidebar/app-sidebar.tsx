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
      title: "Personnages",
      url: "#",
      icon: SquareTerminal,
      items: props.characters.map(
				(character:Character) => (
					{
						title: character.name,
						page: Pages.Character,
						dataId: character.id
					}
				)
			)
    },
    {
      title: "Classes",
      url: "#",
      icon: Bot,
      items: props.classcategories.map(
				(classCategory:ClassCategory) => (
					{
						title: classCategory.name,
						page: Pages.Class,
						dataId: classCategory.id
					}
				)
			),
    },
    {
      title: "Univers",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          page: Pages.World,
        },
        {
          title: "Get Started",
          page: Pages.World,
        },
        {
          title: "Tutorials",
          page: Pages.World,
        },
        {
          title: "Changelog",
          page: Pages.World,
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

"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { DataPages, Pages } from "@/data/pages"
import { Dispatch, SetStateAction } from "react"

export function NavMain({
  items,
	setDataPage
}: {
  items: {
    title: string
		page: Pages,
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
			dataId?: number
    }[]
  }[],
	setDataPage: Dispatch<SetStateAction<DataPages>>
}) {

	const handlePageUpdate = (page:Pages, dataId?:number) => {
		console.log("SET PAGE")
		if (dataId){
			setDataPage({page:page, dataId:dataId})
		} else {
			setDataPage({page:page})
		}
	}

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
								{item.items?
									<SidebarMenuButton className="cursor-pointer" tooltip={item.title}>
										{item.icon && <item.icon />}
												<span>{item.title}</span>
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
									:
									<SidebarMenuButton onClick={() => handlePageUpdate(item.page)} className="cursor-pointer" tooltip={item.title}>
										{item.icon && <item.icon />}
												<span>{item.title}</span>
									</SidebarMenuButton>

								}

              </CollapsibleTrigger>
							{item.items?.map((subItem) => (
								<CollapsibleContent key={subItem.title}>
									<SidebarMenuSub>
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton className="cursor-pointer" asChild>
													<span onClick={() => handlePageUpdate(item.page, subItem.dataId)}>{subItem.title}</span>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
									</SidebarMenuSub>
								</CollapsibleContent>
							))}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

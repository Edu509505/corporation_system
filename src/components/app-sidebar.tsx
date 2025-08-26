import {
  Building2Icon,
  ChartColumnIncreasing,
  CircleDollarSignIcon,
  FilePlus2Icon,
  FileTextIcon,
  Inbox,
  LucideLayoutDashboard,
  PanelTopOpenIcon,
  PencilRuler,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  // SidebarMenuSub,
  // SidebarMenuSubButton,
  // SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Link } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Comercial",
    url: "/",
    icon: Inbox,
    subMenu: [
      { title: "Clientes", url: "/clientes", icon: Building2Icon },
      { title: "Propostas", url: "/propostas", icon: FileTextIcon },
      { title: "Contratos", url: "/oi", icon: PanelTopOpenIcon },
    ],
  },
  {
    title: "Obra",
    url: "/",
    icon: PencilRuler,
    subMenu: [{ title: "Medição", url: "/medicao", icon: PencilRuler }],
  },
  {
    title: "Financeiro",
    url: "/",
    icon: CircleDollarSignIcon,
    subMenu: [
      { title: "Faturamento", url: "/notasFiscais", icon: FilePlus2Icon },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>

                  {item.subMenu?.map((tituloSub, index) => (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem key={index}>
                        <SidebarMenuSubButton asChild>
                          <Link to={tituloSub.url}>
                            <tituloSub.icon />
                            <span className="cursor-pointer">
                              {tituloSub.title}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  ))}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

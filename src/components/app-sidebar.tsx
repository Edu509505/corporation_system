import {
  Building2Icon,
  ChartColumnIncreasing,
  CircleDollarSignIcon,
  FilePlus2Icon,
  FileTextIcon,
  Inbox,
  NotebookPenIcon,
  PanelTopOpenIcon,
  PencilRuler,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Link } from "react-router-dom";
import { useUser } from "@/use.store";
import { NavUser } from "./NavUser";
import LogoHorizon from "../assets/img/logo.svg"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Comercial",
    url: "/clientes",
    icon: Inbox,
    subMenu: [
      { title: "Clientes", url: "/clientes", icon: Building2Icon },
      { title: "Propostas", url: "/propostas", icon: FileTextIcon },
      { title: "Contratos", url: "/contratos", icon: PanelTopOpenIcon },
    ],
  },
  {
    title: "Obra",
    url: "/diarioDeObra",
    icon: PencilRuler,
    subMenu: [
      { title: "Diário De Obra", url: "/diarioDeObra", icon: NotebookPenIcon },
      { title: "Medição", url: "/medicao", icon: PencilRuler },
    ],
  },
  {
    title: "Financeiro",
    url: "/notasFiscais",
    icon: CircleDollarSignIcon,
    subMenu: [
      { title: "Faturamento", url: "/notasFiscais", icon: FilePlus2Icon },
    ],
  },
];

export function AppSidebar() {
  const user = useUser((s) => s.user);

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <span>
                <img src={LogoHorizon} className="size-8"/>
                <h1>Horizon System</h1>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between h-full">
        <div>
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

                    {item.subMenu?.map((sub, index) => (
                      <SidebarMenuSub key={index}>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link to={sub.url}>
                              <sub.icon />
                              <span className="cursor-pointer">
                                {sub.title}
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
        </div>

        {user && (
          <>
            <SidebarFooter>
              <NavUser user={user} />
            </SidebarFooter>
          </>
          // <div className="p-4 border-t text-sm text-muted-foreground">
          //   <p className="mb-2">
          //     Logado como: <strong>{user.name}</strong>
          //   </p>
          //   <button onClick={logout} className="text-red-500 hover:underline">
          //     Sair
          //   </button>
          // </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

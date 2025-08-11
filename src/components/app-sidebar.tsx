import { Building2Icon, CircleDollarSignIcon, Inbox, LucideLayoutDashboard, PanelTopOpenIcon, PencilRuler } from "lucide-react";

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
    icon: LucideLayoutDashboard,
  },
  {
    title: "Administração",
    url: "blog",
    icon: Inbox,
    subMenu: [
      { title: 'Clientes', url: '/oi2', icon: Building2Icon },
      { title: 'Contratos', url: '/oi', icon: PanelTopOpenIcon }
    ]
  },
  {
    title: "Medição",
    url: "medicao",
    icon: PencilRuler,
    // subMenu: [
    //   { title: 'Cadastrar nova Medição', url: '/oi2', icon: CirclePlus },
    //   { title: 'Consultar medição', url: '/oi', icon: Search },
    //   { title: 'Alterar Medição', url: '/oi3', icon: PencilLine },
    //   { title: 'Cancelar Medição', url: '/oi4', icon: CircleXIcon }
    // ]
  },
  {
    title: 'Nota Fiscal',
    url:'notasFiscais',
    icon: CircleDollarSignIcon,
    // subMenu: [
    //   { title: 'Registrar Nota Fiscal', url: '/oi2', icon: CirclePlus },
    //   { title: 'Consultar Nota Fiscal', url: '/oi', icon: Search },
    //   { title: 'Alterar Nota Fiscal', url: '/oi3', icon: PencilLine },
    //   { title: 'Cancelar Nota Fiscal', url: '/oi4', icon: CircleXIcon }
    // ]
  }
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
                            <span className="cursor-pointer">{tituloSub.title}</span>
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

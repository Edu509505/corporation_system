import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col h-screen w-screen">
        <div className="flex items-center justify-start bg-gray-50">
          <SidebarTrigger />
        </div>
        {children}
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

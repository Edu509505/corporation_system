import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
 const location = useLocation();
  const hideSidebar = location.pathname === "/login";

  return (
    <SidebarProvider>
      {!hideSidebar && <AppSidebar />}
      <main className="flex flex-col h-screen w-screen">
        {!hideSidebar && (
          <div className="flex items-center justify-start bg-gray-50">
            <SidebarTrigger />
          </div>
        )}
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

import { useUser } from "@/use.store";
import { Navigate } from "react-router";

export function OnlyAdmins() {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" />;
}

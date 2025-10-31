import { useUser } from "@/use.store";
import { useAuth } from "@/pages/hooks/hooksLogin";
import { Navigate } from "react-router-dom";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

interface OnlyPlebesProps {
  page: React.ReactNode;
}

export function OnlyPlebes({ page }: OnlyPlebesProps) {
  const { user } = useUser();
  const { loading } = useAuth();

  if (loading) return <GlobalLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{page}</>;
}

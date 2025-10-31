import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/use.store";
import { url } from "@/url";

async function fetchUser() {
  const res = await fetch(`${url}/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Não autenticado");

  return res.json();
}

export function useAuth() {
  const { setUser } = useUser();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchUser,
    retry: false,
    onSuccess: (data) => setUser(data),
    onError: () => setUser(null),
  });

  return { user, loading: isLoading };
}

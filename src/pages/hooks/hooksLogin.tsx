import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/use.store";
import { url } from "@/url";
import { useEffect } from "react";

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

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchUser,
    retry: false,
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    } else if (isError) {
      setUser(null);
    }
  }, [user, isError, setUser]);

  return { user, loading: isLoading };
}
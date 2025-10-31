import { useNavigate } from "react-router-dom";
import { useUser } from "@/use.store";
import { url } from "@/url";

export function useLogout() {
  const navigate = useNavigate();
  const { setUser, setToken } = useUser();

  async function logout() {
    try {
      await fetch(`${url}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setToken(null);
      navigate("/login");
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  }

  return logout;
}

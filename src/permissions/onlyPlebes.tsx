import { useUser } from "@/use.store";
import { Navigate } from "react-router";


interface OnlyPlebesProps {
  page: React.ReactNode;
}


export function OnlyPlebes({ page }: OnlyPlebesProps){
    const { user } = useUser()

    // Se não há usuário logado, redireciona para a página de login
    if(!user) return <Navigate to="/login" />

    // Se é um usuário comum (plebe), renderiza a página
    return <>{page}</>;
}



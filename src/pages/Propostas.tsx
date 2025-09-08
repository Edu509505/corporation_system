import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_API_URL;


interface Propostas{
    id: number;
    nome: string;
    descricao: string;
    file: File | null;
}

export default function VerPropostas(){
    const navigate = useNavigate();

   

    const [propostas, setPropostas] = useState<Propostas[]>([]);
    
    useEffect(() => {
        async function verPropostas() {
            const response = await fetch(`${url}/propostas`);
            const body = await response.json();
            setPropostas(body);
        } 
        verPropostas();
    }, []);


    const handleClick = () => {
    navigate('/criarProposta'); // Navigates to the /dashboard route
  };


    return (
        <div>
            <h1>Propostas</h1>

            <Button onClick={handleClick}> 
                Criar Proposta
            </Button>

            <div>
                {
                    propostas.map((proposta) => (
                        <div key={proposta.id}>
                            <div>nome: {proposta.nome}</div>
                            <div>Descricao: {proposta.descricao}</div>
                            {/* <div>Anexo {proposta.file}</div> */}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";

const url = import.meta.env.VITE_API_URL;

interface Versionamento {
    id: number;
    versao: number;
    idProposta: number;
    status: string;
}


export default function VerVersionamento (){
    const navigate = useNavigate();

    const [versionamentos, setVersionamentos] = useState<Versionamento[]>([]);

     useEffect(() => {
            async function verVersionamento() {
                const response = await fetch(`${url}/versionamento`);
                const body = await response.json();
                setVersionamentos(body);
            } 
            verVersionamento();
        }, []);
    

    return (
        <div>
            <h1>Versionamento</h1>

            {/* <Button onClick={handleClick}> 
                Criar Proposta
            </Button> */}

            <div>
                {
                    versionamentos.map((versionamento) => (
                        <div key={versionamento.id}>
                            <div>Versão: {versionamento.versao}</div>
                            <div>Proposta: {versionamento.idProposta}</div>
                            <div>Status: {versionamento.status}</div>
                            {/* <div>Anexo {proposta.file}</div> */}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
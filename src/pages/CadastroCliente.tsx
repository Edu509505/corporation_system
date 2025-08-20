import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
//import type { Cliente } from "../Tipagens"

interface Cliente {
    cliente: string;
    cnpj: string;
    local: string;
    status: "Ativo" | "Pendente" | "Inativo" | null;
    path: string | null;
}


const url = import.meta.env.VITE_API_URL;
//Qualquer Link relacionado ao Back-End sempre importar o .env como boa prática 

export default function CriarCliente() {

    const navigate = useNavigate();

    const voltar = () => {
        navigate(-1)
    }

    const [novoCliente, setNovoCliente] = useState<Cliente>({
        cliente: '',
        cnpj: '',
        local: '',
        status: 'Ativo',
        path: '',
    });

    console.log(novoCliente)

    async function criarCliente(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const response = await fetch(`${url}/clientes`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                cliente: novoCliente.cliente,
                cnpj: novoCliente.cnpj,
                local: novoCliente.local,
                status: novoCliente.status,
                path: novoCliente.path,
            })
        });
        const body = await response.json();
    }
    return (
        <div className="bg-gray-50">
            <form onSubmit={criarCliente} className="flex gap-3 flex-col p-5">
                <h1>Cadastrar Cliente</h1>

                <Input
                    type="text"
                    name="cliente"
                    placeholder="Nome do cliente"
                    value={novoCliente.cliente}
                    onChange={(event) => setNovoCliente({
                        ...novoCliente,
                        cliente: event.target.value
                    })}
                    className="bg-white"
                />
                <Input
                    type="text"
                    name="cnpj"
                    placeholder="Cnpj do cliente"
                    value={novoCliente.cnpj}
                    onChange={(event) => setNovoCliente({
                        ...novoCliente,
                        cnpj: event.target.value
                    })}
                    className="bg-white"
                />
                <Input
                    type="text"
                    name="local"
                    placeholder="local do cliente"
                    value={novoCliente.local}
                    onChange={(event) => setNovoCliente({
                        ...novoCliente,
                        local: event.target.value
                    })}
                    className="bg-white"
                />
                <select
                    name="select"
                    onChange={(event) => setNovoCliente({
                        ...novoCliente,
                        status: event.target.value as "Ativo" | "Pendente" | "Inativo"
                    })}

                >
                    <option value="Ativo" >
                        Ativo
                    </option>
                    <option value="Pendente" >
                        Pendente
                    </option>
                    <option value="Inativo" >
                        Inativo
                    </option>
                </select>



                <Button onClick={voltar} type="submit" className="cursor-pointer">Cadastrar</Button>
            </form>
        </div>
    );
}
import { useState } from "react";


interface Cliente {
    cliente: string;
    cnpj: string;
    local: string;
    status: string;
}

export default function CriarCliente (){

    const url = import.meta.env.VITE_API_URL; 
    //Qualquer Link relacionado ao Back-End sempre importar o .env como boa prática 

    const [novoCliente, setNovoCliente] = useState<Cliente>({
        cliente: '',
        cnpj: '',
        local: '',
        status: '',
    });

    async function criarCliente(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const response = await fetch(`${url}/clientes`, {
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify({
                cliente: novoCliente.cliente,
                cnpj: novoCliente.cnpj,
                local: novoCliente.local,
                status: novoCliente.status
            })
        });
        const body = await response.json();
    }
    return(
        <div>
            <form onSubmit={criarCliente}>
                <h1>Cadastrar Cliente</h1>
                
                <input 
                type="text" 
                name="cliente" 
                placeholder="Nome do cliente" 
                value={novoCliente.cliente} 
                onChange={(event) => setNovoCliente({
                    ...novoCliente,
                    cliente: event.target.value
                })}
                />
                <input 
                type="text" 
                name="cnpj" 
                placeholder="Cnpj do cliente" 
                value={novoCliente.cnpj} 
                onChange={(event) => setNovoCliente({
                    ...novoCliente,
                    cnpj: event.target.value
                })}
                />
                <input 
                type="text" 
                name="local" 
                placeholder="local do cliente" 
                value={novoCliente.local} 
                onChange={(event) => setNovoCliente({
                    ...novoCliente,
                    local: event.target.value
                })}
                />
                <input 
                type="text" 
                name="status" 
                placeholder="Status do cliente" 
                value={novoCliente.status} 
                onChange={(event) => setNovoCliente({
                    ...novoCliente,
                    status: event.target.value
                })}
                /> 

                <button type="submit">CADASTRAR</button>          
            </form>
        </div>
    );
}
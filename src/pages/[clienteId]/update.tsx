import { useState, useEffect} from "react";

interface Cliente {
    cliente: string;
    cnpj: string;
    local: string;
    status: string;
}

export default function EditarCliente (){
    const [editandoCliente, setEditandoCliente] = useState<Cliente>({   
        cliente: '',
        cnpj: '',
        local: '',
        status: '',
    });

    async function editarCliente() {
        const response = await fetch(`http://localhost:3000/clientes/${id}`, {
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
                placeholder="Nome do cliente" 
                value={novoCliente.cnpj} 
                onChange={(event) => setNovoCliente({
                    ...novoCliente,
                    cnpj: event.target.value
                })}
                />
                <input 
                type="text" 
                name="cnpj" 
                placeholder="Nome do cliente" 
                value={novoCliente.local} 
                onChange={(event) => setNovoCliente({
                    ...novoCliente,
                    local: event.target.value
                })}
                />
                <input 
                type="text" 
                name="cnpj" 
                placeholder="Nome do cliente" 
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
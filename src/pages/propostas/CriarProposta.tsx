import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Cliente } from "@/Tipagens";
import { useEffect, useState } from "react";

const url = import.meta.env.VITE_API_URL;

export default function CriarProposta() {
    const [clientes, setClientes] = useState<Cliente[]>([]);

    useEffect(() => {
        async function buscarClientes() {
            const empresas = await fetch(`${url}/clientes`);
            const body = await empresas.json();
            setClientes(body);
        }
        buscarClientes();
    }, []);

    const [clienteSelecionado, setClienteSelecionado] = useState({
        id: ""
    });

    const [novaProposta, setNovaProposta] = useState({
        nome: "",
        descricao: "",
        pathDeAnexo: null
    });

    

    async function criarProposta(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log("Parei aqui")
        const response = await fetch(`${url}/propostas`, {
            method: "POST",
             headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                idCliente: clienteSelecionado.id,
                nomeDaProposta: novaProposta.nome
            })
        });

        const body = await response.json();
        console.log("OI ZÉ DA MANGA", body)

    }

    console.log("Cliente Selecionado: ", clienteSelecionado)
    console.log("Nova Proposta: ", novaProposta)


    return (
        <>
            <div>
                <form onSubmit={criarProposta}>
                    <h1>Criar nova Proposta</h1>

                    <label>Escolha o cliente desejado!</label>
                    <Select
                        value={clienteSelecionado.id}
                        onValueChange={(value) => {
                            setClienteSelecionado({
                                ...clienteSelecionado,
                                id: value.toString()
                            });
                        }}
                    >
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Selecionar cliente" />
                        </SelectTrigger>
                        <SelectContent className="w-[300px]">
                            <SelectGroup>
                                <SelectLabel>Cliente</SelectLabel>
                                {clientes.map((cliente) => (
                                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                        {cliente.cliente}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>


                    <label>Insira o nome da proposta</label>
                    <Input 
                        type="text"
                        name="nome da proposta"
                        placeholder="digite aqui"
                        value={novaProposta.nome}
                        onChange={(event) => 
                            setNovaProposta({
                                ...novaProposta,
                                nome: event.target.value,
                            })
                        }
                        />
                    <Button
                        type="submit"
                        variant="default"
                        className="cursor-pointer"
                    >
                        Criar
                    </Button>
                </form>
            </div>
        </>
    )
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Cliente } from "@/Tipagens";
import { useEffect, useState } from "react";

const url = import.meta.env.VITE_API_URL;

interface formularioComImagem {
    nomeDaProposta: string
    descricao: string
    file: File | null;
}

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
        idCliente: ""
    });

    const [novaProposta, setNovaProposta] = useState <formularioComImagem>({
        nomeDaProposta: "",
        descricao: "",
        file: null
    });

    

    async function criarProposta(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (!novaProposta.file) return;
        const form = new FormData();
        
        form.set('idCliente', clienteSelecionado.idCliente);
        form.set('nomeDaProposta', novaProposta.nomeDaProposta);
        form.set('descricao', novaProposta.descricao);
        form.set('file', novaProposta.file);


        console.log("Parei aqui")
        const response = await fetch(`${url}/proposta`, {
            method: "POST",
            body: form,
            })


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
                        value={clienteSelecionado.idCliente}
                        onValueChange={(value) => {
                            setClienteSelecionado({
                                ...clienteSelecionado,
                                idCliente: value.toString()
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
                        value={novaProposta.nomeDaProposta}
                        onChange={(event) => 
                            setNovaProposta({
                                ...novaProposta,
                            nomeDaProposta: event.target.value,
                            })
                        }
                        />
                    
                    <label>Adicione uma descrição</label>
                    <Input
                    type="text"
                    name="descrição"
                    placeholder="digite aqui"
                    value={novaProposta.descricao}
                    onChange={(event) => 
                        setNovaProposta({
                            ...novaProposta,
                            descricao: event.target.value
                        })
                    }
                    />

                    <label>Adicionar Anexo</label>
                    <Input
                        type="file"
                        onChange={(event) => {
                            const files = event.target.files;
                            if (!files) return;
                            const filesArray = Array.from(files);
                            const file = filesArray[0];
                            setNovaProposta({
                                ...novaProposta,
                                file
                            })
                        }}
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
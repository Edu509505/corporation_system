import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import type { Cliente, Contrato } from "../../Tipagens";

const url = import.meta.env.VITE_API_URL;

function AddMedicao() {

    const [clientes, setClientes] = useState<Cliente[]>([]);

    useEffect(() => {
        async function buscarClientes() {
            const empresas = await fetch(`${url}/clientes`);
            const body = await empresas.json();
            setClientes(body);
        }
        buscarClientes();
    },[])
    
    const [contratos, setContratos] = useState<Contrato[]>([]);

    useEffect(() => {
        async function buscarContratos() {
            const contratos = await fetch(`${url}/contratos`);
            const body = await contratos.json();
            setContratos(body);
        }
        buscarContratos();
    }, [])

    return (
        <div className="bg-gray-50 h-full w-full">
            <h1 className="font-bold text-3xl text-center">Criar Nova Medição</h1>
            <div className="w-full h-32 flex justify-center items-center gap-1">
                <div className="rounded-full bg-ring size-15 flex justify-center items-center">
                    <h1 className="font-bold text-center text-2xl text-white">1</h1>
                </div>
                <div className="w-20 h-1 bg-ring"></div>
                <div className="rounded-full border-solid border-2 border-ring size-15 flex justify-center items-center">
                    <h1 className="font-bold text-center text-2xl text-gray-400">2</h1>
                </div>
                <div className="w-20 h-1 bg-ring"></div>
                <div className="rounded-full border-solid border-2 border-ring size-15 flex justify-center items-center">
                    <h1 className="font-bold text-center text-2xl text-gray-400">3</h1>
                </div>
                <div className="w-20 h-1 bg-ring"></div>
                <div className="rounded-full border-solid border-2 border-ring size-15 flex justify-center items-center">
                    <h1 className="font-bold text-center text-2xl text-gray-400">4</h1>
                </div>
            </div>
            <div className="w-full flex flex-col p-1 pb-5 pt-5 gap-2 items-start justify-center border-b-1 border-solid border-gray-500">
                <h1 className="text-3xl">Selecione a Empresa</h1>
                <Select>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Selecione o contrato"/>
                    </SelectTrigger>
                    <SelectContent className="w-[300px]">
                        <SelectGroup>
                            <SelectLabel>Cliente</SelectLabel>
                            {clientes.map((clientes) => (
                            <SelectItem key={clientes.id} value={clientes.cliente}>
                                {clientes.cliente}
                            </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full flex flex-col p-1 pb-5 pt-5 gap-2 items-start justify-center border-b-1 border-solid border-gray-500">
                <h1 className="text-3xl">Selecione o contrato referente a essa medição</h1>
                <Select>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Selecione o contrato"/>
                    </SelectTrigger>
                    <SelectContent className="w-[300px]">
                        <SelectGroup>
                            <SelectLabel>Contrato Referente a essa Medição</SelectLabel>
                            {contratos.map((contratos) => (
                            <SelectItem key={contratos.id} value={contratos.contrato}>
                                {contratos.contrato}
                            </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                </div>
        </div>
    )
}

export default AddMedicao;
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { table } from "console";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_API_URL;


interface Propostas {
    id: number;
    nomeDaProposta: string;
    descricao: string;
    cliente: {
        cliente: string
    };
}

export default function VerPropostas() {
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
        <div className="h-full flex flex-col p-5 gap-4">
            <div className="flex justify-between w-full">

                <h1 className="text-2xl font-bold">Propostas</h1>

                <Button onClick={handleClick}>
                    Criar Proposta
                </Button>
            </div>

            <div className="border-1 border-black rounded-2xl p-5">
                <Table className="border-b-2 rounded-xl border-b-ring">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Proposta</TableHead>
                            <TableHead>Descrição</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {
                        propostas.map((proposta) => (
                            <TableRow key={proposta.id}>
                                <TableCell>
                                    {proposta.nomeDaProposta}
                                </TableCell>
                                <TableCell >
                                    {proposta.descricao}
                                </TableCell>
                                <TableCell>
                                    {proposta.cliente.cliente}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
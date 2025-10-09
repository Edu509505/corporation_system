import { Button } from "@/components/ui/button";
import { formatToBRL } from "brazilian-values";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, CirclePlusIcon, Eye } from "lucide-react";
//import { table } from "console";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusDeAprovacao from "@/components/componentsVersionamento/StatusDeAprovaao";
import TabelaPropostas from "@/components/versionamento/page";

const url = import.meta.env.VITE_API_URL;

interface Propostas {
  id: number;
  nomeDaProposta: string;
  statusProposta: string;
  valorProposta: string;
  createdAt: string;
  cliente: {
    cliente: string;
  };
}

export default function VerPropostas() {
  const navigate = useNavigate();

  // const [propostas, setPropostas] = useState<Propostas[]>([]);

  // useEffect(() => {
  //   async function verPropostas() {
  //     const response = await fetch(`${url}/propostas`);
  //     const body = await response.json();
  //     setPropostas(body);
  //   }
  //   verPropostas();
  // }, []);

  // console.log(propostas);

  const handleClick = () => {
    navigate("/criarProposta"); // Navigates to the /dashboard route
  };

  // const paginaVersionamento = (propostaId: number) => {
  //   navigate(`/proposta/versionamento/${propostaId}`);
  // };

  return (
    <>
      <main className="flex flex-col items-center justify-start h-screen p-2 pt-5 pb-10 gap-3 bg-gray-50">
        <article className="items-start w-full ">
          <h1 className="font-bold text-3xl">Propostas</h1>
          {/* <h2>Metragem de contratos e trabalhos avulso</h2> */}
        </article>
        <article className="w-full">
          <div className="flex items-center justify-end w-full">
            <Button onClick={handleClick} className="cursor-pointer">
              <CirclePlus />
              Criar Proposta
            </Button>
          </div>
          <TabelaPropostas />
        </article>
      </main>
    </>

    // <div className="h-full flex flex-col p-5 gap-4">
    //   <div className="flex justify-between w-full">
    //     <h1 className="text-2xl font-bold">Propostas</h1>

    //     <Button onClick={handleClick} className="cursor-pointer">
    //       <CirclePlus />
    //       Criar Proposta
    //     </Button>
    //   </div>

    //   <div className="border-gray-400 border-2 rounded-2xl h-full">
    //     <Table className=" h-[100%]">
    //       <TableHeader>
    //         <TableRow>
    //           <TableHead className="w-min-[15%]">Cliente</TableHead>
    //           <TableHead>Proposta</TableHead>
    //           <TableHead>Status</TableHead>
    //           <TableHead>Data</TableHead>
    //           <TableHead>Valor</TableHead>
    //           <TableHead>Ações</TableHead>
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody>
    //         {propostas.map((proposta) => (
    //           <TableRow
    //             key={proposta.id}
    //             onClick={() => paginaVersionamento(proposta.id)}
    //             className="cursor-pointer"
    //           >
    //             <TableCell className="font-bold">
    //               {proposta.cliente.cliente}
    //             </TableCell>
    //             <TableCell>{proposta.nomeDaProposta}</TableCell>
    //             <TableCell>
    //               <StatusDeAprovacao prop={proposta.statusProposta} />
    //             </TableCell>
    //             <TableCell>
    //               {proposta.createdAt
    //                 .split("T")[0]
    //                 .split("-")
    //                 .reverse()
    //                 .join("/")}
    //             </TableCell>
    //             <TableCell>
    //               {formatToBRL(parseInt(proposta.valorProposta))}
    //             </TableCell>
    //             <Link to={`/proposta/versionamento/${proposta.id}`}>
    //               <TableCell className="cursor-pointer">
    //                 <div className="flex justify-center w-24 p-2 rounded-full bg-blue-200 text-blue-900 hover:bg-blue-500 hover:text-white transition">
    //                   <p>Visualizar</p>
    //                 </div>
    //               </TableCell>
    //             </Link>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </div>
    // </div>
  );
}

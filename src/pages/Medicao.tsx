//import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import "../App.css";
import { CirclePlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Table } from "@/components/ui/table";
import { useSuspenseQuery } from "@tanstack/react-query";
const url = import.meta.env.VITE_API_URL;

interface Medicoes {
  id: number,
  idCliente: number,
  idProposta: {
    
  }
  observacao: string,
  periodoInicial: string,
  periodoFinal: string,

}

function Medicao() {

  const { data: medicoes } = useSuspenseQuery({
    queryKey: ["medicoes"],
    queryFn: async()=>{
      const response = await fetch(`${url}/getClientes`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Clientes não encontrados");
      const data = await response.json();
      return data as Medicoes[]
    }
  })

  return (
    <>
      <main className="flex flex-col items-center justify-start h-screen p-4 gap-3 bg-gray-50">
        <article className="items-start w-full ">
          <h1 className="font-bold text-3xl">Medição</h1>
          <h2>Metragem de contratos e trabalhos avulso</h2>
        </article>
        
        <section className="w-full">
          <Link to="/adicionarMedicao">
          <Button className="cursor-pointer"> <CirclePlusIcon/> Criar Nova Medição </Button>
          </Link>
        </section>

        <section className="w-full flex flex-col gap-3">
          <div>
            <Table>

            </Table>
          </div>
        </section>
      </main>
    </>
  );
}

export default Medicao;

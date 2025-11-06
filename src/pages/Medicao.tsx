//import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import "../App.css";
import { CirclePlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import PageTableMedicao from "@/components/medicao/tabelaMedicao/page";

function Medicao() {
  return (
    <>
      <main className="flex flex-col items-center justify-start h-screen p-4 gap-3 bg-gray-50">
        <article className="items-start w-full ">
          <h1 className="font-bold text-3xl">Medição</h1>
          <h2>Metragem de contratos e trabalhos avulso</h2>
        </article>
        <div className="w-full">
          <Link to="/adicionarMedicao">
            <Button className="cursor-pointer">
              {" "}
              <CirclePlusIcon /> Criar Nova Medição{" "}
            </Button>
          </Link>
          <PageTableMedicao />
        </div>
      </main>
    </>
  );
}

export default Medicao;

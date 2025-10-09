//import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import "../App.css";
import DemoPage from "@/components/pyments/page";
import { CirclePlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

function Medicao() {
  return (
    <>
      <main className="flex flex-col items-center justify-start h-screen p-2 pt-5 pb-10 gap-3 bg-gray-50">
        <article className="items-start w-full ">
          <h1 className="font-bold text-3xl">Medição</h1>
          <h2>Metragem de contratos e trabalhos avulso</h2>
        </article>
        <article className="w-full">
          <div className="flex items-center justify-end w-full">
            <Link to="/adicionarMedicao">
              <Button className="cursor-pointer">
                <CirclePlusIcon className="size-5" />
                Adicionar
              </Button>
            </Link>
          </div>
          <DemoPage />
        </article>
      </main>
    </>
  );
}

export default Medicao;

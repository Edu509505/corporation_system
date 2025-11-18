import PageTableContratos from "@/components/contrato/tabela/page";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";


function Contratos() {
  return (
    <div className="min-h-screen bg-gradient-to-br bg-background flex flex-col p-8 gap-3">
      <h1 className="text-3xl font-bold">Contratos</h1>
      <p className="text-gray-600">
        Visualize e gerencie os contratos cadastrados no sistema.
      </p>
      <div>
        <Link to="/addContrato">
          <Button variant="default" className="cursor-pointer">
            <CirclePlus />
            Novo Contrato
          </Button>
        </Link>
      </div>
      <PageTableContratos />
    </div>
  );
}

export default Contratos;

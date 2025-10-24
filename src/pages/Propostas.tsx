import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import TabelaPropostas from "@/components/componentsVersionamento/page";


export default function VerPropostas() {
  return (
    <>
      <main className="flex flex-col items-center justify-start h-screen p-2 pt-5 pb-10 gap-3 bg-gray-50">
        <article className="items-start w-full ">
          <h1 className="font-bold text-3xl">Propostas</h1>
          {/* <h2>Metragem de contratos e trabalhos avulso</h2> */}
        </article>
        <article className="w-full">
          <div className="flex items-center justify-end w-full">
           <Link to="/criarProposta">
            <Button className="cursor-pointer">
              <CirclePlus />
              Criar Proposta
            </Button>
           </Link>
          </div>
          <TabelaPropostas />
        </article>
      </main>
    </>
  );
}

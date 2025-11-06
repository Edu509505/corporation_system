import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";

function NotasFiscais() {
  return (
    <main className="flex flex-col justify-start h-screen p-4 gap-3 bg-gray-50">
      <section>
        <h1 className="font-bold text-2xl">Notas Fiscais e Faturamento</h1>
      </section>
      <section>
        <Link to="/addNotaFiscal">
          <Button>
            <CirclePlus />
            Adicionar Nova Nota
          </Button>
        </Link>
      </section>
    </main>
  );
}

export default NotasFiscais;

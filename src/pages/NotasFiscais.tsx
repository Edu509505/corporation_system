//import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import "../App.css";
import { CirclePlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

function NotasFiscais() {
  return (
    <>
      <main className="flex flex-col items-center justify-start h-screen p-4 gap-3 bg-gray-50">
        <article className="items-start w-full ">
          <h1 className="font-bold text-3xl">Faturamento</h1>
          <h2>Notas fiscais e faturamento</h2>
        </article>
        <div className="w-full">
          <Link to="/adicionarNotaFiscal">
          <Button className="cursor-pointer"> <CirclePlusIcon/> Criar Nova Medição </Button>
          </Link>
        </div>
      </main>
    </>
  );
}

export default NotasFiscais;

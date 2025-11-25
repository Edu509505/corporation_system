import { Button } from "@/components/ui/button";
import {
  Building,
  CirclePlusIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ClientList } from "@/components/clientes/ClientList";


export default function VerClientes() {
  return (
    <div className="w-full p-2 flex flex-col bg-background">
      <div className="flex items-center gap-3">
        <Building />
        <h1 className="text-2xl font-bold">Clientes cadastrados</h1>
      </div>

      <div className="w-full h-20 flex justify-between items-center">
        <h2 className="text-2xl ">Lista de Clientes</h2>
        <Link to="/cadastro">
          <Button className="cursor-pointer">
            <CirclePlusIcon className="size-5" />
            Adicionar
          </Button>
        </Link>
      </div>
      <section className="w-full flex flex-wrap justify-center gap-3">
        <ClientList/>
      </section>
    </div>
  );
}

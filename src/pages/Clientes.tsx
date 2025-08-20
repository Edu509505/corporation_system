import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
interface Clientes {
  id: number;
  cliente: string;
  cnpj: string;
  local: string;
  status: string;
}

export default function VerClientes() {
  const [clientes, setClientes] = useState<Clientes[]>([]);
  useEffect(() => {
    async function VerClientes() {
      const response = await fetch("http://localhost:3000/clientes");
      const body = await response.json();
      setClientes(body);
    }
    VerClientes();
  }, []);

  return (
    <>
      <div className="w-full h-screen p-5 flex flex-col">
        <div className="w-full h-60 bg-amber-100 flex justify-between items-baseline">
          <h2>Lista de Clientes</h2>
          <Link to="/cadastro">
            <Button className="cursor-pointer">
              <CirclePlusIcon className="size-5" />
              Adicionar
            </Button>
          </Link>
        </div>
        <section className="w-full h-full flex-col">
          {clientes.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid #ccc",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <p>
                <strong>Nome:</strong> {c.cliente}
              </p>
              <p>
                <strong>CNPJ:</strong> {c.cnpj}
              </p>
              <p>
                <strong>Local:</strong> {c.local}
              </p>
              <p>
                <strong>Status:</strong> {c.status}
              </p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
